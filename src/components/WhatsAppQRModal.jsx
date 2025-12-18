import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 28px;
  width: 100%;
  max-width: 480px;
  padding: 40px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.connected ? '#ECFDF5' : '#FEF2F2'};
  color: ${props => props.connected ? '#10B981' : '#EF4444'};
  border-radius: 14px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 20px;
  margin-bottom: 20px;
`;

const QRImage = styled.img`
  width: 280px;
  height: 280px;
  border-radius: 16px;
  background: white;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Instructions = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;

  ol {
    text-align: left;
    margin-top: 12px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;

const RefreshButton = styled(motion.button)`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  color: white;
  border-radius: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
`;

const LoadingSpinner = styled.div`
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 16px;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top-color: #6366F1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const WhatsAppQRModal = ({ isOpen, onClose }) => {
    const [qrCode, setQrCode] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQRCode = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/status');
            const data = await response.json();

            if (data.connected) {
                setIsConnected(true);
                setQrCode(null);
            } else {
                setIsConnected(false);
                // Intentar obtener el QR
                const qrResponse = await fetch('http://localhost:3001/api/whatsapp/qr');
                const qrData = await qrResponse.json();
                if (qrData.qr) {
                    setQrCode(qrData.qr);
                }
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor de WhatsApp');
            console.error('Error fetching QR:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchQRCode();
            // Verificar estado cada 5 segundos
            const interval = setInterval(fetchQRCode, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <ModalContent
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
            >
                <Header>
                    <Title>Conectar WhatsApp</Title>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </Header>

                <StatusBadge connected={isConnected}>
                    {isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
                    {isConnected ? 'WhatsApp Conectado' : 'WhatsApp Desconectado'}
                </StatusBadge>

                {isConnected ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>
                            ¡Conexión Exitosa!
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Tu WhatsApp está conectado y listo para enviar reportes.
                        </p>
                    </div>
                ) : (
                    <>
                        <QRContainer>
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : error ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
                                    <WifiOff size={48} style={{ marginBottom: '16px' }} />
                                    <p>{error}</p>
                                </div>
                            ) : qrCode ? (
                                <QRImage src={qrCode} alt="WhatsApp QR Code" />
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                    <p>Generando código QR...</p>
                                </div>
                            )}
                        </QRContainer>

                        <Instructions>
                            <strong>Instrucciones:</strong>
                            <ol>
                                <li>Abre WhatsApp en tu teléfono</li>
                                <li>Ve a Configuración → Dispositivos vinculados</li>
                                <li>Toca "Vincular un dispositivo"</li>
                                <li>Escanea este código QR</li>
                            </ol>
                        </Instructions>

                        <RefreshButton
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={fetchQRCode}
                        >
                            <RefreshCw size={18} />
                            Actualizar QR
                        </RefreshButton>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default WhatsAppQRModal;
