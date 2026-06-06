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

class QuickActionsWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetIds: IntArray,
  ) {
    for (widgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.widget_quick_actions)

      val openWrite = pendingActivity(context, Uri.parse("mespensees://editor"))
      val openRecord = pendingActivity(context, Uri.parse("mespensees://editor?record=true"))
      val openSearch = pendingActivity(context, Uri.parse("mespensees://search"))
      val openCoffre = pendingActivity(context, Uri.parse("mespensees://coffre"))

      views.setOnClickPendingIntent(R.id.btn_write, openWrite)
      views.setOnClickPendingIntent(R.id.btn_record, openRecord)
      views.setOnClickPendingIntent(R.id.btn_search, openSearch)
      views.setOnClickPendingIntent(R.id.btn_coffre, openCoffre)

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
