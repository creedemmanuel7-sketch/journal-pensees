package com.mespensees.app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.mespensees.app.MainActivity
import com.mespensees.app.R
import java.util.Calendar

/**
 * Widget « Inspiration du jour ».
 *
 * Affiche une invitation d'écriture (prompt) qui change chaque jour, choisie
 * dans une liste codée en dur ci-dessous. AUCUNE donnée de note (titre ou
 * contenu) n'est lue ni affichée : seules des données non sensibles transitent.
 */
class MesPenseesWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetIds: IntArray,
  ) {
    val prompt = promptOfTheDay()

    for (widgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_mes_pensees)
      views.setTextViewText(R.id.widget_prompt, prompt)

      val openEditor = pendingActivity(context, Uri.parse("mespensees://editor"))
      views.setOnClickPendingIntent(R.id.widget_root, openEditor)
      views.setOnClickPendingIntent(R.id.widget_write_button, openEditor)

      appWidgetManager.updateAppWidget(widgetId, views)
    }
  }

  private fun pendingActivity(context: Context, data: Uri): PendingIntent {
    val intent =
        Intent(context, MainActivity::class.java).apply {
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
          this.data = data
        }
    return PendingIntent.getActivity(
        context,
        data.hashCode(),
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  companion object {
    const val PREFS_NAME = "MesPenseesWidget"
    const val KEY_STREAK = "streak"

    /** Sélectionne une invitation déterministe pour la journée en cours. */
    fun promptOfTheDay(): String {
      val cal = Calendar.getInstance()
      val dayOfYear = cal.get(Calendar.DAY_OF_YEAR)
      val year = cal.get(Calendar.YEAR)
      val index = ((dayOfYear + year) % PROMPTS.size + PROMPTS.size) % PROMPTS.size
      return PROMPTS[index]
    }

    private val PROMPTS =
        listOf(
            "Qu'est-ce qui t'a fait sourire aujourd'hui ?",
            "Décris une émotion que tu ressens en ce moment.",
            "De quoi es-tu reconnaissant·e aujourd'hui ?",
            "Quel petit pas as-tu fait vers un objectif ?",
            "Qu'aimerais-tu te rappeler de cette journée ?",
            "Quelle pensée revient souvent dans ta tête ?",
            "Décris un moment de calme récent.",
            "Qu'as-tu appris sur toi cette semaine ?",
            "À qui penses-tu en ce moment, et pourquoi ?",
            "Quel rêve aimerais-tu poursuivre ?",
            "Qu'est-ce qui t'a demandé du courage récemment ?",
            "Décris un endroit où tu te sens bien.",
            "Quelle est ta plus petite victoire du jour ?",
            "Qu'aimerais-tu lâcher prise aujourd'hui ?",
            "Quel son, odeur ou image t'a marqué·e ?",
            "Que dirais-tu à toi-même d'il y a un an ?",
            "Quelle habitude aimerais-tu cultiver ?",
            "Décris une rencontre qui t'a touché·e.",
            "Qu'est-ce qui t'apaise quand tout va vite ?",
            "Quelle question te trotte dans la tête ?",
            "Note trois choses simples que tu aimes.",
            "Qu'est-ce qui te donne de l'énergie ?",
            "Comment te sens-tu, vraiment, là maintenant ?",
            "Quel souvenir aimerais-tu préserver ?",
            "Que veux-tu accueillir dans ta vie ?",
            "Quelle pensée mérite d'être posée ici ?",
            "Décris ta journée en une phrase.",
            "Qu'est-ce qui t'a inspiré·e dernièrement ?",
        )
  }
}
