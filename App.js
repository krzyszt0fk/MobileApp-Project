import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const App = () => {
  const initialProductInfo = { name: 'Zeskanuj kod QR produktu', manufacturer: 'Zeskanuj kod QR produktu' };
  const [productInfo, setProductInfo] = useState(initialProductInfo);
  const [showResetButton, setShowResetButton] = useState(false);

  const fetchProductInfo = async (barcodeData) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcodeData}.json?fields=product_name,brands`);
      const data = await response.json();
      if (data.status === 1) {
        // Jeśli produkt został znaleziony w API Open Food Facts
        const product = data.product;
        const productName = product.product_name || 'Nie znaleziono';
        const manufacturer = product.brands || 'Nie znaleziono';
        setProductInfo({ name: productName, manufacturer: manufacturer });
        setShowResetButton(true);
      } else {
        setProductInfo(initialProductInfo);
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas pobierania danych produktu:', error);
      setProductInfo(initialProductInfo);
    }
  };

  const handleQRCodeScan = ({ data }) => {
    // Wywołaj funkcję pobierającą informacje o produkcie na podstawie kodu QR
    fetchProductInfo(data);
  };
//zastosowanie przycisku reset
  const handleReset = () => {
    setProductInfo(initialProductInfo);
    setShowResetButton(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <QRCodeScanner
        onRead={handleQRCodeScan}
        flashMode={RNCamera.Constants.FlashMode.torch}
        reactivate={true}
        reactivateTimeout={500}
        showMarker={true}
        topContent={
          <View>
            <Text>Produkt: {productInfo.name}</Text>
            <Text>Producent: {productInfo.manufacturer}</Text>
          </View>
        }
      />
      {showResetButton && (
        <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
          <Button title="Resetuj" onPress={handleReset} />
        </View>
      )}
    </View>
  );
};

export default App;
