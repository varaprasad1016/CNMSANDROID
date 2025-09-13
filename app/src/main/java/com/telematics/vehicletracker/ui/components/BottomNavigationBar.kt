package com.telematics.vehicletracker.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import com.telematics.vehicletracker.R

data class NavigationItem(
    val route: String,
    val icon: ImageVector,
    val label: String
)

@Composable
fun BottomNavigationBar(
    selectedTab: Int,
    onTabSelected: (Int, String) -> Unit
) {
    val navigationItems = listOf(
        NavigationItem(
            route = "dashboard",
            icon = Icons.Default.Dashboard,
            label = "Dashboard"
        ),
        NavigationItem(
            route = "map",
            icon = Icons.Default.Map,
            label = "Map"
        ),
        NavigationItem(
            route = "video",
            icon = Icons.Default.Videocam,
            label = "Video"
        ),
        NavigationItem(
            route = "devices",
            icon = Icons.Default.DeviceHub,
            label = "Devices"
        ),
        NavigationItem(
            route = "settings",
            icon = Icons.Default.Settings,
            label = "Settings"
        )
    )

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        contentColor = MaterialTheme.colorScheme.onSurface
    ) {
        navigationItems.forEachIndexed { index, item ->
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label
                    )
                },
                label = {
                    Text(
                        text = item.label,
                        style = MaterialTheme.typography.labelSmall
                    )
                },
                selected = selectedTab == index,
                onClick = {
                    onTabSelected(index, item.route)
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    indicatorColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }
    }
}