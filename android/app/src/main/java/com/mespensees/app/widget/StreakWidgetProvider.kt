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

/**
 * Widget « Série d'écriture ».
 *
 * Affiche le nombre de jours consécutifs d'écriture (streak), une donnée NON
 * sensible poussée par l'app via SharedPreferences. Aucun titre ni contenu de
 * note n'est lu ni affiché.
 */
class StreakWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetIds: IntArray,
  ) {
    val prefs = context.getSharedPreferences(MesPenseesWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE)
    val streak = prefs.getInt(MesPenseesWidgetProvider.KEY_STREAK, 0)

    for (widgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_streak)
      views.setTextViewText(R.id.widget_streak_value, streak.toString())

      val caption =
          when {
            streak <= 0 -> context.getString(R.string.widget_streak_empty)
            streak == 1 -> context.getString(R.string.widget_streak_caption_one)
            else -> context.getString(R.string.widget_streak_caption_many, streak)
          }
      views.setTextViewText(R.id.widget_streak_caption, caption)

      val openEditor = pendingActivity(context, Uri.parse("mespensees://editor"))
      views.setOnClickPendingIntent(R.id.widget_root, openEditor)
      views.setOnClickPendingIntent(R.id.widget_streak_button, openEditor)

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
}
