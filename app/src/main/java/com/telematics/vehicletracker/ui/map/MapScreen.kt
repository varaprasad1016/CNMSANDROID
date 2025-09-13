package com.telematics.vehicletracker.ui.map

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import com.telematics.vehicletracker.ui.theme.*

data class VehicleLocation(
    val id: String,
    val name: String,
    val position: LatLng,
    val status: String,
    val speed: String,
    val isOnline: Boolean,
    val heading: Float = 0f
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapScreen(navController: NavController) {
    val context = LocalContext.current
    var mapType by remember { mutableStateOf(MapType.NORMAL) }
    var showTraffic by remember { mutableStateOf(false) }
    var selectedVehicle by remember { mutableStateOf<VehicleLocation?>(null) }
    
    // Sample vehicle locations (Beijing area)
    val vehicles = remember {
        listOf(
            VehicleLocation(
                "V001", "Fleet Vehicle 01", 
                LatLng(39.9042, 116.4074), "Moving", "65 km/h", true, 45f
            ),
            VehicleLocation(
                "V002", "Fleet Vehicle 02", 
                LatLng(39.9142, 116.4174), "Parked", "0 km/h", true
            ),
            VehicleLocation(
                "V003", "Fleet Vehicle 03", 
                LatLng(39.8942, 116.3974), "Offline", "--", false
            ),
            VehicleLocation(
                "V004", "Fleet Vehicle 04", 
                LatLng(39.9242, 116.4274), "Moving", "45 km/h", true, 120f
            )
        )
    }
    
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(LatLng(39.9042, 116.4074), 12f)
    }
    
    Box(modifier = Modifier.fillMaxSize()) {
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            properties = MapProperties(
                mapType = mapType,
                isTrafficEnabled = showTraffic
            ),
            uiSettings = MapUiSettings(
                zoomControlsEnabled = false,
                compassEnabled = true,
                myLocationButtonEnabled = true
            )
        ) {
            vehicles.forEach { vehicle ->
                Marker(
                    state = MarkerState(position = vehicle.position),
                    title = vehicle.name,
                    snippet = "${vehicle.status} • ${vehicle.speed}",
                    onClick = {
                        selectedVehicle = vehicle
                        true
                    }
                )
            }
        }
        
        // Top Controls
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f)
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Row(
                    modifier = Modifier.padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Map,
                        contentDescription = "Map",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Live Tracking",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
            
            Column {
                FloatingActionButton(
                    onClick = {
                        mapType = when (mapType) {
                            MapType.NORMAL -> MapType.SATELLITE
                            MapType.SATELLITE -> MapType.HYBRID
                            MapType.HYBRID -> MapType.TERRAIN
                            else -> MapType.NORMAL
                        }
                    },
                    modifier = Modifier.size(48.dp),
                    containerColor = MaterialTheme.colorScheme.surface
                ) {
                    Icon(
                        imageVector = Icons.Default.Layers,
                        contentDescription = "Map Type",
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                FloatingActionButton(
                    onClick = { showTraffic = !showTraffic },
                    modifier = Modifier.size(48.dp),
                    containerColor = if (showTraffic) MaterialTheme.colorScheme.primary 
                                   else MaterialTheme.colorScheme.surface
                ) {
                    Icon(
                        imageVector = Icons.Default.Traffic,
                        contentDescription = "Traffic",
                        tint = if (showTraffic) Color.White 
                              else MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
        
        // Vehicle Status Panel
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Fleet Status",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    
                    Row {
                        StatusIndicator(
                            count = vehicles.count { it.isOnline },
                            total = vehicles.size,
                            label = "Online",
                            color = SuccessGreen
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        StatusIndicator(
                            count = vehicles.count { it.status == "Moving" },
                            total = vehicles.size,
                            label = "Moving",
                            color = AccentOrange
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Vehicle List
                vehicles.forEach { vehicle ->
                    VehicleMapItem(
                        vehicle = vehicle,
                        isSelected = selectedVehicle?.id == vehicle.id,
                        onClick = {
                            selectedVehicle = vehicle
                            // Center map on selected vehicle
                            cameraPositionState.position = CameraPosition.fromLatLngZoom(
                                vehicle.position, 15f
                            )
                        }
                    )
                    if (vehicle != vehicles.last()) {
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun StatusIndicator(
    count: Int,
    total: Int,
    label: String,
    color: Color
) {
    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(color)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = "$count/$total $label",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun VehicleMapItem(
    vehicle: VehicleLocation,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) 
                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
            else MaterialTheme.colorScheme.surface
        ),
        border = if (isSelected) 
            androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary)
        else null
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(RoundedCornerShape(5.dp))
                        .background(
                            if (vehicle.isOnline) SuccessGreen else MediumGray
                        )
                )
                
                Spacer(modifier = Modifier.width(8.dp))
                
                Column {
                    Text(
                        text = vehicle.name,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "${vehicle.status} • ${vehicle.speed}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Icon(
                imageVector = Icons.Default.GpsFixed,
                contentDescription = "Locate",
                tint = if (isSelected) MaterialTheme.colorScheme.primary 
                      else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}