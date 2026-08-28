# Sphère 3 — Sûreté et confidentialité

Mes Pensées se vend sur **la confiance**. Une faille UX (PIN en clair, widget avec le titre) casse le produit.

## Invariants (ne jamais casser)

1. Pas de backend Mes Pensées, pas de compte.
2. PIN jamais stocké en clair (PBKDF2 + sel).
3. Notes chiffrées au repos ; re-chiffrement si le PIN change.
4. Mode leurre : aucune API `getActiveNotes` / export / stats / widgets avec le vrai journal.
5. Notifications et widgets : **zéro** titre ou corps de note.
6. Wipe = AsyncStorage **et** dossiers fichiers (`mespensees-media`, intrusion, ambiances).

## Permissions (principe du moindre privilège)

| Permission | Quand | Si refusée |
|------------|--------|------------|
| Caméra | Photo note **ou** intrusion | Fonction masquée, pas de crash |
| Micro | Audio / dictée | Idem |
| Notifications | Rappels | L’app marche sans |
| Localisation | Optionnelle | Note sans lieu |

## Menaces réalistes

- Téléphone dérobé, PIN deviné → leurre + auto-destruction (déjà là).
- Shoulder surfing du widget → déjà corrigé (pas de titre).
- Sauvegarde Android cloud de l’utilisateur → hors de notre contrôle ; le dire en CGU.
- Nominatim : IP + coordonnées si géoloc activée.

## V2

- Écran **Confidentialité** + **CGU** dans l’app (Play Store l’exige).
- Phrase honnête : « local-first », pas « militaire ».
- Option « tout hors-ligne » qui désactive géoloc et Nominatim.
