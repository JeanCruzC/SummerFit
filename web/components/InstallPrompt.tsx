"use client";

import { useState, useEffect } from "react";
import { X, Share, PlusSquare, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Utility functions
function isIOS(): boolean {
    if (typeof window === "undefined") return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

function isInStandaloneMode(): boolean {
    if (typeof window === "undefined") return false;
    // Para iOS
    if ("standalone" in window.navigator) {
        return (window.navigator as any).standalone === true;
    }
    // Para otros navegadores
    return window.matchMedia("(display-mode: standalone)").matches;
}

function isSafari(): boolean {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios");
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showIOSModal, setShowIOSModal] = useState(false);
    const [isIOSDevice, setIsIOSDevice] = useState(false);

    useEffect(() => {
        // No mostrar si ya está instalada
        if (isInStandaloneMode()) {
            return;
        }

        // Verificar si fue descartado previamente (con expiración de 7 días)
        const dismissedAt = localStorage.getItem("pwa-banner-dismissed");
        if (dismissedAt) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) {
                return;
            }
        }

        // Detectar iOS
        const iOS = isIOS();
        setIsIOSDevice(iOS);

        if (iOS) {
            // En iOS, mostrar después de 2 segundos
            const timer = setTimeout(() => setShowBanner(true), 2000);
            return () => clearTimeout(timer);
        } else {
            // Android/Desktop: esperar evento beforeinstallprompt
            const handler = (e: Event) => {
                e.preventDefault();
                setDeferredPrompt(e);
                setShowBanner(true);
            };
            window.addEventListener("beforeinstallprompt", handler);
            return () => window.removeEventListener("beforeinstallprompt", handler);
        }
    }, []);

    async function handleInstall() {
        if (isIOSDevice) {
            setShowIOSModal(true);
            return;
        }

        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setShowBanner(false);
        }

        setDeferredPrompt(null);
    }

    function handleDismiss() {
        localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
        setShowBanner(false);
    }

    return (
        <>
            {/* Banner de instalación */}
            <AnimatePresence>
                {showBanner && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
                    >
                        <div className="bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-2xl shadow-2xl p-4">
                            <div className="flex items-center gap-3">
                                {/* App Icon */}
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0">
                                    🔥
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                                        Instala SummerFit
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Acceso rápido desde tu pantalla de inicio
                                    </p>
                                </div>

                                {/* Close button */}
                                <button
                                    onClick={handleDismiss}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Install button */}
                            <button
                                onClick={handleInstall}
                                className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                            >
                                <Download className="h-5 w-5" />
                                {isIOSDevice ? "Ver cómo instalar" : "Instalar ahora"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal con instrucciones para iOS */}
            <AnimatePresence>
                {showIOSModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowIOSModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
                                    🔥
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                    Instalar SummerFit
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Sigue estos pasos en Safari
                                </p>
                            </div>

                            {/* Warning si no está en Safari */}
                            {!isSafari() && (
                                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                                        ⚠️ Abre esta página en <strong>Safari</strong> para poder instalar la app.
                                    </p>
                                </div>
                            )}

                            {/* Steps */}
                            <div className="space-y-4">
                                <Step number={1}>
                                    <div className="flex items-center gap-2">
                                        <span>Toca el botón</span>
                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                            <Share className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="font-semibold">Compartir</span>
                                    </div>
                                </Step>

                                <Step number={2}>
                                    <div className="flex items-center gap-2">
                                        <span>Selecciona</span>
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <PlusSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            <span className="font-semibold text-sm">Añadir a inicio</span>
                                        </div>
                                    </div>
                                </Step>

                                <Step number={3}>
                                    <span>
                                        Toca <span className="font-semibold text-purple-600 dark:text-purple-400">"Añadir"</span> en la esquina superior derecha
                                    </span>
                                </Step>
                            </div>

                            {/* Footer */}
                            <button
                                onClick={() => {
                                    setShowIOSModal(false);
                                    setShowBanner(false);
                                }}
                                className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                            >
                                ¡Entendido!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {number}
            </div>
            <div className="flex-1 pt-1 text-gray-700 dark:text-gray-300">
                {children}
            </div>
        </div>
    );
}
