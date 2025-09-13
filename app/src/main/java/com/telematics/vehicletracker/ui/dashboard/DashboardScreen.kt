package com.telematics.vehicletracker.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.telematics.vehicletracker.ui.theme.*

data class VehicleStatus(
    val id: String,
    val name: String,
    val status: String,
    val location: String,
    val speed: String,
    val lastUpdate: String,
    val isOnline: Boolean
)

data class QuickAction(
    val title: String,
    val icon: ImageVector,
    val color: Color,
    val route: String
)

data class DashboardMetric(
    val title: String,
    val value: String,
    val icon: ImageVector,
    val color: Color,
    val change: String? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    val vehicles = remember {
        listOf(
            VehicleStatus("V001", "Fleet Vehicle 01", "Moving", "Beijing, China", "65 km/h", "2 min ago", true),
            VehicleStatus("V002", "Fleet Vehicle 02", "Parked", "Shanghai, China", "0 km/h", "5 min ago", true),
            VehicleStatus("V003", "Fleet Vehicle 03", "Offline", "Guangzhou, China", "--", "2 hours ago", false),
            VehicleStatus("V004", "Fleet Vehicle 04", "Moving", "Shenzhen, China", "45 km/h", "1 min ago", true)
        )
    }
    
    val quickActions = remember {
        listOf(
            QuickAction("Live Map", Icons.Default.Map, PrimaryBlue, "map"),
            QuickAction("Video Feed", Icons.Default.Videocam, AccentOrange, "video"),
            QuickAction("Add Device", Icons.Default.Add, SuccessGreen, "devices"),
            QuickAction("Reports", Icons.Default.Assessment, SecondaryTeal, "reports")
        )
    }
    
    val metrics = remember {
        listOf(
            DashboardMetric("Total Vehicles", "4", Icons.Default.DirectionsCar, PrimaryBlue, "+1"),
            DashboardMetric("Online", "3", Icons.Default.CheckCircle, SuccessGreen),
            DashboardMetric("Moving", "2", Icons.Default.Navigation, AccentOrange),
            DashboardMetric("Alerts", "1", Icons.Default.Warning, ErrorRed)
        )
    }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Vehicle Tracker",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Fleet Management Dashboard",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                IconButton(
                    onClick = { /* Refresh data */ }
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Refresh",
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
        
        item {
            // Metrics Cards
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(metrics) { metric ->
                    MetricCard(metric = metric)
                }
            }
        }
        
        item {
            // Quick Actions
            Text(
                text = "Quick Actions",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }
        
        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(quickActions) { action ->
                    QuickActionCard(
                        action = action,
                        onClick = {
                            navController.navigate(action.route)
                        }
                    )
                }
            }
        }
        
        item {
            // Vehicle Status
            Text(
                text = "Vehicle Status",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }
        
        items(vehicles) { vehicle ->
            VehicleStatusCard(vehicle = vehicle)
        }
    }
}

@Composable
fun MetricCard(metric: DashboardMetric) {
    Card(
        modifier = Modifier
            .width(120.dp)
            .height(100.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Icon(
                    imageVector = metric.icon,
                    contentDescription = null,
                    tint = metric.color,
                    modifier = Modifier.size(20.dp)
                )
                metric.change?.let { change ->
                    Text(
                        text = change,
                        style = MaterialTheme.typography.labelSmall,
                        color = SuccessGreen
                    )
                }
            }
            
            Column {
                Text(
                    text = metric.value,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = metric.title,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun QuickActionCard(
    action: QuickAction,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(100.dp)
            .height(80.dp),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = action.color.copy(alpha = 0.1f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = action.icon,
                contentDescription = null,
                tint = action.color,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = action.title,
                style = MaterialTheme.typography.labelSmall,
                color = action.color,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun VehicleStatusCard(vehicle: VehicleStatus) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(12.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(
                            if (vehicle.isOnline) SuccessGreen else MediumGray
                        )
                )
                
                Spacer(modifier = Modifier.width(12.dp))
                
                Column {
                    Text(
                        text = vehicle.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "${vehicle.status} • ${vehicle.location}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Speed: ${vehicle.speed} • ${vehicle.lastUpdate}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = "View Details",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}