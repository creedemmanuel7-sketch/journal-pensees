import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { Platform, Alert } from 'react-native';

const escapeHtml = (text) =>
  String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const shareFile = async (filePath, options) => {
  const url = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
  await Share.open({
    url,
    type: options.type,
    title: options.title,
    failOnCancel: false,
  });
};

const filePathFromUri = (uri) => {
  if (!uri) return null;
  return uri.startsWith('file://') ? uri.replace('file://', '') : uri;
};

const uriToDataUrl = async (uri) => {
  const path = filePathFromUri(uri);
  if (!path) return null;
  try {
    const exists = await RNFS.exists(path);
    if (!exists) return null;
    const base64 = await RNFS.readFile(path, 'base64');
    const ext = path.split('.').pop()?.toLowerCase();
    const mime =
      ext === 'png'
        ? 'image/png'
        : ext === 'webp'
          ? 'image/webp'
          : 'image/jpeg';
    return `data:${mime};base64,${base64}`;
  } catch (e) {
    console.warn('uriToDataUrl:', e);
    return null;
  }
};

/** Notes prêtes pour l’export PDF : texte + images uniquement (pas de vocaux). */
export const prepareNotesForPdf = (notes) =>
  notes.map((note) => ({
    ...note,
    media: (note.media || []).filter((m) => m.type === 'image'),
  }));

/** Notes prêtes pour l’export TXT : texte seul. */
export const prepareNotesForTxt = (notes) =>
  notes.map((note) => ({
    ...note,
    media: [],
    bgImage: null,
  }));

export const exportToPDF = async (notes, accent = '#f0a090') => {
  const exportNotes = prepareNotesForPdf(notes);
  const sortedNotes = [...exportNotes].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const notesHTMLParts = await Promise.all(
    sortedNotes.map(async (note, i) => {
      const imageMedia = (note.media || []).filter((m) => m.type === 'image');
      const imagesHTMLParts = await Promise.all(
        imageMedia.map(async (m) => {
          const src = await uriToDataUrl(m.uri);
          if (!src) return '';
          return `
          <div class="note-image-container">
            <img src="${src}" class="note-image" />
          </div>
        `;
        }),
      );
      const imagesHTML = imagesHTMLParts.join('');

      return `
    <div class="note">
      <div class="note-header">
        <div class="note-number">${String(i + 1).padStart(2, '0')}</div>
        <div>
          <div class="note-title">${escapeHtml(note.titre || 'Sans titre')}</div>
          <div class="note-date">${formatDate(note.date)} · ${note.mood || '😌'}${note.location ? ` · ${escapeHtml(note.location)}` : ''}</div>
        </div>
      </div>
      <div class="note-content">
        ${escapeHtml(note.contenu || '').replace(/\n/g, '<br/>')}
        ${imagesHTML}
      </div>
      ${note.capsule ? '<p class="capsule-tag">⏳ Capsule temporelle</p>' : ''}
    </div>
  `;
    }),
  );

  const notesHTML = notesHTMLParts.join('');
  const totalWords = exportNotes.reduce(
    (sum, n) => sum + (n.wordCount || 0),
    0,
  );
  const dateNow = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; background: #0a0a0b; color: #e8e8ea; }
        .cover { min-height: 100vh; text-align: center; padding: 60px; page-break-after: always; }
        .cover-title { font-size: 64px; font-style: italic; color: ${accent}; }
        .cover-sub { font-size: 11px; letter-spacing: 4px; color: #5a5a60; }
        .notes-container { padding: 48px; }
        .section-title { font-size: 32px; font-style: italic; color: ${accent}; margin-bottom: 40px; }
        .note { margin-bottom: 48px; border-bottom: 1px solid #1e1e21; padding-bottom: 48px; }
        .note-header { display: flex; gap: 20px; margin-bottom: 20px; }
        .note-number { font-size: 36px; color: #2a2a2f; }
        .note-title { font-size: 26px; font-style: italic; color: ${accent}; }
        .note-date { font-size: 10px; color: #5a5a60; }
        .note-content { font-size: 14px; line-height: 1.9; color: #9a9a9e; padding-left: 68px; }
        .note-image-container { margin-top: 16px; text-align: left; padding-left: 68px; }
        .note-image { max-width: 100%; max-height: 400px; border-radius: 8px; border: 1px solid #1e1e21; }
        .capsule-tag { padding-left: 68px; color: #3ecf8e; font-size: 10px; }
        .empty-state { text-align: center; padding: 80px; color: #5a5a60; }
      </style>
    </head>
    <body>
      <div class="cover">
        <p style="font-size:80px">🔐</p>
        <h1 class="cover-title">Mes Pensées</h1>
        <p class="cover-sub">JOURNAL INTIME CHIFFRÉ · ZÉRO NUAGE</p>
        <p>${exportNotes.length} pensées · ${totalWords} mots · ${new Date().getFullYear()}</p>
        <p>EXPORTÉ LE ${dateNow.toUpperCase()}</p>
        <p style="font-size:10px;color:#5a5a60;margin-top:24px">Les enregistrements vocaux ne sont pas inclus dans l’export PDF.</p>
      </div>
      <div class="notes-container">
        <h2 class="section-title">Toutes mes pensées</h2>
        ${exportNotes.length === 0 ? '<p class="empty-state">Aucune pensée à exporter.</p>' : notesHTML}
      </div>
    </body>
    </html>
  `;

  try {
    const file = await RNHTMLtoPDF.convert({
      html,
      fileName: `mes-pensees-${Date.now()}`,
      ...(Platform.OS === 'ios' ? { directory: 'Documents' } : {}),
    });

    if (!file?.filePath) {
      Alert.alert('Export PDF', 'Le fichier PDF n’a pas pu être généré.');
      return { success: false, error: new Error('PDF non généré') };
    }

    await shareFile(file.filePath, {
      type: 'application/pdf',
      title: 'Exporter Mes Pensées',
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    Alert.alert(
      'Export PDF',
      e?.message || 'Une erreur est survenue lors de la génération du PDF.',
    );
    return { success: false, error: e };
  }
};

export const exportToTXT = async (notes) => {
  const exportNotes = prepareNotesForTxt(notes);
  const sortedNotes = [...exportNotes].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const content = sortedNotes
    .map(
      (note, i) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[${String(i + 1).padStart(2, '0')}] ${note.titre || 'Sans titre'} ${note.mood || ''}
${formatDate(note.date)}${note.location ? ` · ${note.location}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${note.contenu || ''}

`,
    )
    .join('\n');

  const header = `MES PENSÉES — JOURNAL INTIME
Exporté le ${new Date().toLocaleDateString('fr-FR')}
${exportNotes.length} pensées · ${exportNotes.reduce((s, n) => s + (n.wordCount || 0), 0)} mots
(Photos et enregistrements vocaux non inclus)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  try {
    const dir = RNFS.CachesDirectoryPath;
    const fileUri = `${dir}/mes-pensees-${Date.now()}.txt`;
    await RNFS.writeFile(fileUri, header + content, 'utf8');

    await shareFile(fileUri, {
      type: 'text/plain',
      title: 'Exporter Mes Pensées',
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    Alert.alert(
      'Export texte',
      e?.message || 'Impossible d’exporter le fichier texte.',
    );
    return { success: false, error: e };
  }
};
