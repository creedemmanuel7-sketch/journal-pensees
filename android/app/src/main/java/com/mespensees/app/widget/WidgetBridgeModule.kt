package com.mespensees.app.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Pont natif des widgets. Ne reçoit QUE des données non sensibles (série
 * d'écriture). Aucun titre ni contenu de note n'est stocké ni affiché.
 */
class WidgetBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "MesPenseesWidget"

  @ReactMethod
  fun update(streak: Int, promise: Promise) {
    try {
      val ctx = reactApplicationContext
      ctx.getSharedPreferences(MesPenseesWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE)
          .edit()
          .putInt(MesPenseesWidgetProvider.KEY_STREAK, streak)
          .apply()

      refreshProvider(ctx, MesPenseesWidgetProvider::class.java)
      refreshProvider(ctx, StreakWidgetProvider::class.java)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("WIDGET_UPDATE_FAILED", e.message, e)
    }
  }

  private fun refreshProvider(ctx: Context, provider: Class<*>) {
    val manager = AppWidgetManager.getInstance(ctx)
    val component = ComponentName(ctx, provider)
    val ids = manager.getAppWidgetIds(component)
    if (ids.isNotEmpty()) {
      val intent =
          Intent(ctx, provider).apply {
            action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
          }
      ctx.sendBroadcast(intent)
    }
  }
}
