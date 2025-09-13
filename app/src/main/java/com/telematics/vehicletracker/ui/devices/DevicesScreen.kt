package com.telematics.vehicletracker.ui.devices

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.navigation.NavController
import com.telematics.vehicletracker.ui.theme.*

data class TrackingDevice(
    val id: String,
    val name: String,
    val deviceType: String,
    val imei: String,
    val status: DeviceStatus,
    val batteryLevel: Int,
    val signalStrength: Int,
    val lastUpdate: String,
    val vehicleAssigned: String?,
    val firmwareVersion: String
)

enum class DeviceStatus {
    ONLINE, OFFLINE, WARNING, ERROR
}

data class DeviceType(
    val id: String,
    val name: String,
    val description: String,
    val features: List<String>
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DevicesScreen(navController: NavController) {
    var showAddDeviceDialog by remember { mutableStateOf(false) }
    var selectedDevice by remember { mutableStateOf<TrackingDevice?>(null) }
    var searchQuery by remember { mutableStateOf("") }
    
    val devices = remember {
        listOf(
            TrackingDevice(
                "DEV001", "GPS Tracker Pro", "GPS/GLONASS", "860123456789012",
                DeviceStatus.ONLINE, 85, 95, "2 min ago", "Fleet Vehicle 01", "v2.1.3"
            ),
            TrackingDevice(
                "DEV002", "OBD Tracker", "OBD-II", "860123456789013",
                DeviceStatus.ONLINE, 92, 88, "1 min ago", "Fleet Vehicle 02", "v1.8.2"
            ),
            TrackingDevice(
                "DEV003", "Asset Tracker", "GPS/LTE", "860123456789014",
                DeviceStatus.WARNING, 15, 72, "5 min ago", null, "v2.0.1"
            ),
            TrackingDevice(
                "DEV004", "Fleet Monitor", "GPS/GLONASS", "860123456789015",
                DeviceStatus.OFFLINE, 0, 0, "2 hours ago", "Fleet Vehicle 04", "v2.1.3"
            ),
            TrackingDevice(
                "DEV005", "Smart Tracker", "GPS/WiFi", "860123456789016",
                DeviceStatus.ONLINE, 78, 91, "30 sec ago", null, "v3.0.0"
            )
        )
    }
    
    val deviceTypes = remember {
        listOf(
            DeviceType(
                "GPS_BASIC", "Basic GPS Tracker",
                "Standard GPS tracking with basic features",
                listOf("Real-time tracking", "Geofencing", "Speed alerts")
            ),
            DeviceType(
                "GPS_PRO", "Professional GPS Tracker",
                "Advanced GPS tracking with extended features",
                listOf("Real-time tracking", "Geofencing", "Speed alerts", "Driver behavior", "Fuel monitoring")
            ),
            DeviceType(
                "OBD", "OBD-II Tracker",
                "Plug-and-play OBD port tracker",
                listOf("Vehicle diagnostics", "Fuel consumption", "Engine health", "Real-time tracking")
            ),
            DeviceType(
                "ASSET", "Asset Tracker",
                "Long-battery life tracker for assets",
                listOf("Extended battery", "Waterproof", "Motion detection", "Temperature monitoring")
            )
        )
    }
    
    val filteredDevices = devices.filter {
        it.name.contains(searchQuery, ignoreCase = true) ||
        it.imei.contains(searchQuery, ignoreCase = true) ||
        it.vehicleAssigned?.contains(searchQuery, ignoreCase = true) == true
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Header
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Device Management",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Manage tracking devices and fleet assets",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    
                    FloatingActionButton(
                        onClick = { showAddDeviceDialog = true },
                        containerColor = MaterialTheme.colorScheme.primary
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add Device",
                            tint = Color.White
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Search Bar
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = {
                        Text("Search devices, IMEI, or vehicle...")
                    },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search"
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(
                                onClick = { searchQuery = "" }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Clear,
                                    contentDescription = "Clear"
                                )
                            }
                        }
                    },
                    singleLine = true
                )
            }
        }
        
        // Device Statistics
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            DeviceStatCard(
                title = "Total",
                count = devices.size,
                color = PrimaryBlue,
                modifier = Modifier.weight(1f)
            )
            DeviceStatCard(
                title = "Online",
                count = devices.count { it.status == DeviceStatus.ONLINE },
                color = SuccessGreen,
                modifier = Modifier.weight(1f)
            )
            DeviceStatCard(
                title = "Warning",
                count = devices.count { it.status == DeviceStatus.WARNING },
                color = WarningAmber,
                modifier = Modifier.weight(1f)
            )
            DeviceStatCard(
                title = "Offline",
                count = devices.count { it.status == DeviceStatus.OFFLINE },
                color = ErrorRed,
                modifier = Modifier.weight(1f)
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Device List
        LazyColumn(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(filteredDevices) { device ->
                DeviceCard(
                    device = device,
                    onClick = {
                        selectedDevice = device
                    }
                )
            }
        }
    }
    
    // Add Device Dialog
    if (showAddDeviceDialog) {
        AddDeviceDialog(
            deviceTypes = deviceTypes,
            onDismiss = { showAddDeviceDialog = false },
            onConfirm = { deviceType, deviceName, imei ->
                // Handle device addition
                showAddDeviceDialog = false
            }
        )
    }
    
    // Device Details Dialog
    selectedDevice?.let { device ->
        DeviceDetailsDialog(
            device = device,
            onDismiss = { selectedDevice = null },
            onEdit = {
                // Handle device editing
                selectedDevice = null
            },
            onDelete = {
                // Handle device deletion
                selectedDevice = null
            }
        )
    }
}

@Composable
fun DeviceStatCard(
    title: String,
    count: Int,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.height(80.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = count.toString(),
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun DeviceCard(
    device: TrackingDevice,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(
                                    when (device.status) {
                                        DeviceStatus.ONLINE -> SuccessGreen
                                        DeviceStatus.WARNING -> WarningAmber
                                        DeviceStatus.ERROR -> ErrorRed
                                        DeviceStatus.OFFLINE -> MediumGray
                                    }
                                )
                        )
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        Text(
                            text = device.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(4.dp))
                    
                    Text(
                        text = "${device.deviceType} • IMEI: ${device.imei}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    device.vehicleAssigned?.let { vehicle ->
                        Text(
                            text = "Assigned to: $vehicle",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
                
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = device.lastUpdate,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Row {
                        // Battery Level
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Battery6Bar,
                                contentDescription = "Battery",
                                modifier = Modifier.size(16.dp),
                                tint = when {
                                    device.batteryLevel > 50 -> SuccessGreen
                                    device.batteryLevel > 20 -> WarningAmber
                                    else -> ErrorRed
                                }
                            )
                            Text(
                                text = "${device.batteryLevel}%",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        // Signal Strength
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.SignalCellular4Bar,
                                contentDescription = "Signal",
                                modifier = Modifier.size(16.dp),
                                tint = when {
                                    device.signalStrength > 70 -> SuccessGreen
                                    device.signalStrength > 40 -> WarningAmber
                                    else -> ErrorRed
                                }
                            )
                            Text(
                                text = "${device.signalStrength}%",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AddDeviceDialog(
    deviceTypes: List<DeviceType>,
    onDismiss: () -> Unit,
    onConfirm: (DeviceType, String, String) -> Unit
) {
    var selectedDeviceType by remember { mutableStateOf<DeviceType?>(null) }
    var deviceName by remember { mutableStateOf("") }
    var imei by remember { mutableStateOf("") }
    
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier.padding(24.dp)
            ) {
                Text(
                    text = "Add New Device",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Device Name
                OutlinedTextField(
                    value = deviceName,
                    onValueChange = { deviceName = it },
                    label = { Text("Device Name") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // IMEI
                OutlinedTextField(
                    value = imei,
                    onValueChange = { imei = it },
                    label = { Text("IMEI Number") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Device Type Selection
                Text(
                    text = "Device Type",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                deviceTypes.forEach { deviceType ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedDeviceType == deviceType,
                            onClick = { selectedDeviceType = deviceType }
                        )
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        Column {
                            Text(
                                text = deviceType.name,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = deviceType.description,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                // Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(
                        onClick = onDismiss
                    ) {
                        Text("Cancel")
                    }
                    
                    Spacer(modifier = Modifier.width(8.dp))
                    
                    Button(
                        onClick = {
                            selectedDeviceType?.let { deviceType ->
                                onConfirm(deviceType, deviceName, imei)
                            }
                        },
                        enabled = selectedDeviceType != null && 
                                 deviceName.isNotBlank() && 
                                 imei.isNotBlank()
                    ) {
                        Text("Add Device")
                    }
                }
            }
        }
    }
}

@Composable
fun DeviceDetailsDialog(
    device: TrackingDevice,
    onDismiss: () -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier.padding(24.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = device.name,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Box(
                        modifier = Modifier
                            .size(12.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(
                                when (device.status) {
                                    DeviceStatus.ONLINE -> SuccessGreen
                                    DeviceStatus.WARNING -> WarningAmber
                                    DeviceStatus.ERROR -> ErrorRed
                                    DeviceStatus.OFFLINE -> MediumGray
                                }
                            )
                    )
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Device Information
                DeviceInfoRow("Device Type", device.deviceType)
                DeviceInfoRow("IMEI", device.imei)
                DeviceInfoRow("Status", device.status.name)
                DeviceInfoRow("Battery Level", "${device.batteryLevel}%")
                DeviceInfoRow("Signal Strength", "${device.signalStrength}%")
                DeviceInfoRow("Last Update", device.lastUpdate)
                DeviceInfoRow("Firmware", device.firmwareVersion)
                device.vehicleAssigned?.let {
                    DeviceInfoRow("Assigned Vehicle", it)
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    OutlinedButton(
                        onClick = onDelete,
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = ErrorRed
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete",
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Delete")
                    }
                    
                    Row {
                        TextButton(
                            onClick = onDismiss
                        ) {
                            Text("Close")
                        }
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        Button(
                            onClick = onEdit
                        ) {
                            Icon(
                                imageVector = Icons.Default.Edit,
                                contentDescription = "Edit",
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Edit")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DeviceInfoRow(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}