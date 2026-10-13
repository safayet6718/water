import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string, options?: { width?: number; margin?: number; color?: { dark: string; light: string } }): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 256,
      margin: options?.margin ?? 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

export function formatClientQrCode(clientCode: string): string {
  return `AQUA-CLIENT:${clientCode}`;
}

export function formatJarQrCode(jarCode: string): string {
  return `AQUA-JAR:${jarCode}`;
}

export function parseScannedQr(raw: string): { type: 'client' | 'jar' | 'unknown'; code: string } {
  const text = raw.trim();
  if (text.startsWith('AQUA-CLIENT:')) {
    return { type: 'client', code: text.replace('AQUA-CLIENT:', '') };
  }
  if (text.startsWith('AQUA-JAR:')) {
    return { type: 'jar', code: text.replace('AQUA-JAR:', '') };
  }
  if (text.startsWith('CL-')) {
    return { type: 'client', code: text };
  }
  if (text.startsWith('J-')) {
    return { type: 'jar', code: text };
  }
  return { type: 'unknown', code: text };
}
