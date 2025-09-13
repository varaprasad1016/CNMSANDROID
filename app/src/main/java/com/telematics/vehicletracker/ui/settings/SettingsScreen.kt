package com.telematics.vehicletracker.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.window.Dialog
import androidx.navigation.NavController
import com.telematics.vehicletracker.ui.theme.*

data class SettingItem(
    val title: String,
    val subtitle: String? = null,
    val icon: ImageVector,
    val type: SettingType,
    val value: Any? = null,
    val action: (() -> Unit)? = null
)

enum class SettingType {
    SWITCH, NAVIGATION, ACTION, INFO
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavController) {
    var showServerDialog by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }
    var notificationsEnabled by remember { mutableStateOf(true) }
    var locationEnabled by remember { mutableStateOf(true) }
    var autoSync by remember { mutableStateOf(true) }
    var darkMode by remember { mutableStateOf(false) }
    
    val settingSections = listOf(
        "Connection" to listOf(
            SettingItem(
                "Server Configuration",
                "Configure CMSV6/CNMS server settings",
                Icons.Default.Settings,
                SettingType.NAVIGATION
            ) { showServerDialog = true },
            SettingItem(
                "Connection Status",
                "Connected to server",
                Icons.Default.CloudDone,
                SettingType.INFO
            ),
            SettingItem(
                "Auto Sync",
                "Automatically sync data with server",
                Icons.Default.Sync,
                SettingType.SWITCH,
                autoSync
            )
        ),
        "Notifications" to listOf(
            SettingItem(
                "Push Notifications",
                "Receive alerts and updates",
                Icons.Default.Notifications,
                SettingType.SWITCH,
                notificationsEnabled
            ),
            SettingItem(
                "Location Alerts",
                "Geofence and location-based alerts",
                Icons.Default.LocationOn,
                SettingType.SWITCH,
                locationEnabled
            ),
            SettingItem(
                "Sound & Vibration",
                "Configure alert sounds",
                Icons.Default.VolumeUp,
                SettingType.NAVIGATION
            )
        ),
        "Display" to listOf(
            SettingItem(
                "Dark Mode",
                "Use dark theme",
                Icons.Default.DarkMode,
                SettingType.SWITCH,
                darkMode
            ),
            SettingItem(
                "Map Style",
                "Choose map appearance",
                Icons.Default.Map,
                SettingType.NAVIGATION
            ),
            SettingItem(
                "Units",
                "Distance and speed units",
                Icons.Default.Straighten,
                SettingType.NAVIGATION
            )
        ),
        "Security" to listOf(
            SettingItem(
                "Change Password",
                "Update your account password",
                Icons.Default.Lock,
                SettingType.NAVIGATION
            ),
            SettingItem(
                "Two-Factor Authentication",
                "Enable 2FA for enhanced security",
                Icons.Default.Security,
                SettingType.NAVIGATION
            ),
            SettingItem(
                "Session Timeout",
                "Auto-logout after inactivity",
                Icons.Default.Timer,
                SettingType.NAVIGATION
            )
        ),
        "Data & Storage" to listOf(
            SettingItem(
                "Cache Management",
                "Clear app cache and temporary files",
                Icons.Default.Storage,
                SettingType.ACTION
            ),
            SettingItem(
                "Data Usage",
                "Monitor network data consumption",
                Icons.Default.DataUsage,
                SettingType.NAVIGATION
            ),
            SettingItem(
                "Export Data",
                "Export tracking and device data",
                Icons.Default.Download,
                SettingType.ACTION
            )
        ),
        "Support" to listOf(
            SettingItem(
                "Help & FAQ",
                "Get help and find answers",
                Icons.Default.Help,
                SettingType.NAVIGATION
            ),
            SettingItem(
                "Contact Support",
                "Get technical assistance",
                Icons.Default.Support,
                SettingType.NAVIGATION
            ),
            SettingItem(
                "Send Feedback",
                "Share your thoughts and suggestions",
                Icons.Default.Feedback,
                SettingType.ACTION
            ),
            SettingItem(
                "About",
                "App version and information",
                Icons.Default.Info,
                SettingType.NAVIGATION
            ) { showAboutDialog = true }
        )
    )
    
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
                Text(
                    text = "Settings",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Configure app preferences and account settings",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        
        // Settings List
        LazyColumn(
            modifier = Modifier.padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            settingSections.forEach { (sectionTitle, items) ->
                item {
                    SettingsSection(
                        title = sectionTitle,
                        items = items,
                        onSwitchToggle = { item, enabled ->
                            when (item.title) {
                                "Push Notifications" -> notificationsEnabled = enabled
                                "Location Alerts" -> locationEnabled = enabled
                                "Auto Sync" -> autoSync = enabled
                                "Dark Mode" -> darkMode = enabled
                            }
                        }
                    )
                }
            }
            
            item {
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
    
    // Server Configuration Dialog
    if (showServerDialog) {
        ServerConfigDialog(
            onDismiss = { showServerDialog = false }
        )
    }
    
    // About Dialog
    if (showAboutDialog) {
        AboutDialog(
            onDismiss = { showAboutDialog = false }
        )
    }
}

@Composable
fun SettingsSection(
    title: String,
    items: List<SettingItem>,
    onSwitchToggle: (SettingItem, Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            items.forEachIndexed { index, item ->
                SettingItemRow(
                    item = item,
                    onSwitchToggle = { enabled ->
                        onSwitchToggle(item, enabled)
                    }
                )
                
                if (index < items.size - 1) {
                    Divider(
                        modifier = Modifier.padding(vertical = 8.dp),
                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                    )
                }
            }
        }
    }
}

@Composable
fun SettingItemRow(
    item: SettingItem,
    onSwitchToggle: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = item.title,
                modifier = Modifier.size(24.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column {
                Text(
                    text = item.title,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
                
                item.subtitle?.let { subtitle ->
                    Text(
                        text = subtitle,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        
        when (item.type) {
            SettingType.SWITCH -> {
                Switch(
                    checked = item.value as? Boolean ?: false,
                    onCheckedChange = onSwitchToggle
                )
            }
            SettingType.NAVIGATION -> {
                IconButton(
                    onClick = { item.action?.invoke() }
                ) {
                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = "Navigate",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            SettingType.ACTION -> {
                TextButton(
                    onClick = { item.action?.invoke() }
                ) {
                    Text("Action")
                }
            }
            SettingType.INFO -> {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(SuccessGreen)
                )
            }
        }
    }
}

@Composable
fun ServerConfigDialog(
    onDismiss: () -> Unit
) {
    var serverUrl by remember { mutableStateOf("https://demo.cmsv6.com") }
    var username by remember { mutableStateOf("admin") }
    var password by remember { mutableStateOf("") }
    var port by remember { mutableStateOf("8080") }
    var useHttps by remember { mutableStateOf(true) }
    
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
                    text = "Server Configuration",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                OutlinedTextField(
                    value = serverUrl,
                    onValueChange = { serverUrl = it },
                    label = { Text("Server URL") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                OutlinedTextField(
                    value = port,
                    onValueChange = { port = it },
                    label = { Text("Port") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                OutlinedTextField(
                    value = username,
                    onValueChange = { username = it },
                    label = { Text("Username") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Switch(
                        checked = useHttps,
                        onCheckedChange = { useHttps = it }
                    )
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    Text(
                        text = "Use HTTPS",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
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
                            // Handle server configuration save
                            onDismiss()
                        }
                    ) {
                        Text("Save")
                    }
                }
            }
        }
    }
}

@Composable
fun AboutDialog(
    onDismiss: () -> Unit
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
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.DirectionsCar,
                    contentDescription = "App Icon",
                    modifier = Modifier.size(64.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "Vehicle Tracker",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                
                Text(
                    text = "Version 1.0.0",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = "Professional vehicle tracking and fleet management solution compatible with CMSV6 and CNMS systems.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Divider()
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Column {
                    AboutInfoRow("Build", "2024.01.15")
                    AboutInfoRow("Platform", "Android")
                    AboutInfoRow("License", "Commercial")
                    AboutInfoRow("Support", "support@vehicletracker.com")
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Close")
                }
            }
        }
    }
}

@Composable
fun AboutInfoRow(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.Medium
        )
    }
}