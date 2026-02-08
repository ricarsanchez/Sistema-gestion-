import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Camera, X } from 'lucide-react';

const BarcodeScanner = ({ onScan, onClose, isOpen }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getCameras();
    } else {
      stopScanning();
    }
    
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        // Prefer back camera on mobile
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back')) || devices[0];
        setSelectedCamera(backCamera.id);
      } else {
        setError('No se encontraron cámaras disponibles');
      }
    } catch (err) {
      setError('Error al acceder a las cámaras: ' + err.message);
    }
  };

  const startScanning = async () => {
    if (!selectedCamera) return;

    try {
      setError(null);
      setScanning(true);

      const scanner = new Html5Qrcode('barcode-reader');
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.777778
        },
        (decodedText) => {
          // Successfully scanned
          onScan(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Scanning in progress, errors are normal
        }
      );
    } catch (err) {
      setError('Error al iniciar el escáner: ' + err.message);
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Escanear Código de Barras
          </DialogTitle>
          <DialogDescription>
            Apunta la cámara al código de barras del producto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {!scanning && !error && cameras.length > 0 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">
                Presiona el botón para activar la cámara
              </p>
              {cameras.length > 1 && (
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {cameras.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.label || `Cámara ${camera.id}`}
                    </option>
                  ))}
                </select>
              )}
              <Button onClick={startScanning} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Activar Cámara
              </Button>
            </div>
          )}

          <div id="barcode-reader" className={scanning ? 'block' : 'hidden'} />

          {scanning && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm text-center">
                📷 Escaneando... Apunta al código de barras
              </div>
              <Button onClick={stopScanning} variant="outline" className="w-full">
                <X className="mr-2 h-4 w-4" />
                Detener Escáner
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
