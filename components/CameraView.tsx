import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Button,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";
import { theme } from "../constants/theme";

interface CameraViewProps {
    onTextRecognized: (text: string) => void;
    onError: (error: string) => void;
}

export default function CameraComponent({
    onTextRecognized,
    onError,
}: CameraViewProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [isProcessing, setIsProcessing] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef<any>(null);

    // Debug logging function
    const addDebugLog = (message: string) => {
        setDebugInfo((prev) => [
            ...prev.slice(-9),
            `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
    };

    useEffect(() => {
        addDebugLog("Component mounted");

        if (!permission) {
            addDebugLog("Permission not yet determined");
        } else if (!permission.granted) {
            addDebugLog("Permission not granted, requesting...");
            requestPermission();
        } else {
            addDebugLog("Permission already granted");
        }
    }, [permission, requestPermission]);

    const handleCameraReady = () => {
        addDebugLog("Camera is ready");
        setCameraReady(true);
    };

    const handleCameraError = (error: any) => {
        const errorMsg = `Camera error: ${JSON.stringify(error)}`;
        addDebugLog(errorMsg);
        onError(errorMsg);
    };

    const takePicture = async () => {
        addDebugLog("Take picture called");

        if (!cameraRef.current) {
            const errorMsg = "Camera ref is null";
            addDebugLog(errorMsg);
            onError(errorMsg);
            return;
        }

        if (!cameraReady) {
            const errorMsg = "Camera not ready yet";
            addDebugLog(errorMsg);
            onError(errorMsg);
            return;
        }

        try {
            addDebugLog("Taking picture...");
            setIsProcessing(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
                skipProcessing: false,
            });

            addDebugLog(`Picture taken, URI: ${photo.uri}`);
            setPhotoUri(photo.uri);

            addDebugLog(
                "Starting text recognition with react-native-mlkit-ocr..."
            );
            const result = await MlkitOcr.detectFromUri(photo.uri);
            // result is an array of blocks, join all text
            const text = result.map((block) => block.text).join(" ");

            addDebugLog(`Text recognition completed. Raw text: ${text}`);

            // Clean and process the text
            const cleanedText = text
                .replace(/\n{2,}/g, "\n")
                .replace(/\n/g, " ")
                .trim();

            addDebugLog(`Cleaned text: "${cleanedText}"`);

            // Try to extract license plate pattern
            const platePattern = extractLicensePlate(cleanedText);
            if (platePattern) {
                addDebugLog(`License plate detected: ${platePattern}`);
                onTextRecognized(platePattern);
            } else {
                addDebugLog(
                    "No license plate pattern found, returning full text"
                );
                onTextRecognized(cleanedText);
            }
        } catch (err: any) {
            const errorMessage = `OCR Error: ${
                err.message || JSON.stringify(err)
            }`;
            addDebugLog(errorMessage);
            onError(errorMessage);
        } finally {
            addDebugLog("Processing completed");
            setIsProcessing(false);
            setPhotoUri(null);
        }
    };

    const extractLicensePlate = (text: string): string | null => {
        // Moroccan license plate patterns
        const patterns = [
            // Format: 12345-A-6 (old format)
            /\b\d{5}-[A-Z]-[1-9]\b/,
            // Format: 123456-A-6 (new format)
            /\b\d{6}-[A-Z]-[1-9]\b/,
            // Format: A-12345-6
            /\b[A-Z]-\d{5}-[1-9]\b/,
            // Format: A-123456-6
            /\b[A-Z]-\d{6}-[1-9]\b/,
            // Format: 12345A6 (without dashes)
            /\b\d{5}[A-Z][1-9]\b/,
            // Format: 123456A6 (without dashes)
            /\b\d{6}[A-Z][1-9]\b/,
            // Format: A123456 (without dashes)
            /\b[A-Z]\d{6}\b/,
            // Format: A123456 (without dashes)
            /\b[A-Z]\d{5}\b/,
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }

        return null;
    };

    const handlePermissionRequest = async () => {
        addDebugLog("Manually requesting permission");
        try {
            const result = await requestPermission();
            addDebugLog(`Permission result: ${JSON.stringify(result)}`);
        } catch (error) {
            addDebugLog(`Permission request error: ${JSON.stringify(error)}`);
        }
    };

    if (!permission) {
        return (
            <View style={styles.centered}>
                <Text style={styles.debugText}>
                    Checking camera permission...
                </Text>
                <Button
                    title="Request Permission"
                    onPress={handlePermissionRequest}
                />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.debugText}>
                    Camera permission not granted
                </Text>
                <Text style={styles.debugText}>
                    Status: {permission.status}
                </Text>
                <Button
                    title="Request Camera Permission"
                    onPress={handlePermissionRequest}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {photoUri && isProcessing ? (
                <View style={styles.camera}>
                    <Image
                        source={{ uri: photoUri }}
                        style={styles.camera}
                        resizeMode="cover"
                    />
                    <View style={styles.processingOverlay}>
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary[500]}
                        />
                        <Text style={styles.processingText}>
                            Analyzing image...
                        </Text>
                    </View>
                </View>
            ) : (
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="back"
                    onCameraReady={handleCameraReady}
                />
            )}

            {/* Camera Controls */}
            <View style={styles.controls}>
                {isProcessing && (
                    <View style={styles.processingIndicator}>
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary[500]}
                        />
                        <Text style={styles.processingText}>Processing...</Text>
                    </View>
                )}

                <Pressable
                    onPress={takePicture}
                    style={[
                        styles.button,
                        isProcessing && styles.buttonDisabled,
                    ]}
                    disabled={isProcessing}
                >
                    <View style={styles.buttonInner} />
                </Pressable>

                <Text style={styles.buttonText}>
                    {isProcessing ? "Processing..." : "Scanner"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    camera: {
        flex: 1,
    },
    controls: {
        position: "absolute",
        bottom: 40,
        width: "100%",
        alignItems: "center",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: theme.colors.background.primary,
    },
    button: {
        backgroundColor: "white",
        width: 75,
        height: 75,
        borderRadius: 37.5,
        borderWidth: 5,
        borderColor: theme.colors.primary[500],
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonInner: {
        backgroundColor: theme.colors.primary[500],
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: theme.colors.text.inverse,
        fontSize: 14,
        fontWeight: "500",
    },
    processingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    processingIndicator: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    processingText: {
        color: "white",
        marginTop: 10,
        fontSize: 16,
        fontWeight: "500",
    },
    debugPanel: {
        position: "absolute",
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 10,
        borderRadius: 8,
        maxHeight: 200,
    },
    debugContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: 8,
        maxHeight: 150,
    },
    debugTitle: {
        color: theme.colors.primary[500],
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    debugText: {
        color: "white",
        fontSize: 12,
        marginBottom: 2,
    },
    debugLog: {
        color: theme.colors.text.secondary,
        fontSize: 10,
        marginBottom: 1,
    },
});
