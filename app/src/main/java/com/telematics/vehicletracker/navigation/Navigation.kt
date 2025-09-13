package com.telematics.vehicletracker.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.telematics.vehicletracker.ui.dashboard.DashboardScreen
import com.telematics.vehicletracker.ui.map.MapScreen
import com.telematics.vehicletracker.ui.video.VideoScreen
import com.telematics.vehicletracker.ui.devices.DevicesScreen
import com.telematics.vehicletracker.ui.settings.SettingsScreen

sealed class Screen(val route: String) {
    object Dashboard : Screen("dashboard")
    object Map : Screen("map")
    object Video : Screen("video")
    object Devices : Screen("devices")
    object Settings : Screen("settings")
}

@Composable
fun NavigationGraph(
    navController: NavHostController,
    startDestination: String = Screen.Dashboard.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Dashboard.route) {
            DashboardScreen(navController)
        }
        
        composable(Screen.Map.route) {
            MapScreen(navController)
        }
        
        composable(Screen.Video.route) {
            VideoScreen(navController)
        }
        
        composable(Screen.Devices.route) {
            DevicesScreen(navController)
        }
        
        composable(Screen.Settings.route) {
            SettingsScreen(navController)
        }
    }
}