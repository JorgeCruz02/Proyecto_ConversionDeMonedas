import { Camera, ImageType } from 'expo-camera/legacy';
import { CameraType } from 'expo-camera/legacy';
import { useContext } from 'react'
import { useState, useRef } from 'react';
import { Image, Platform, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Endpoints } from "@/constants/Endpoints";
import { MyContext } from "./Context";
import { router } from "expo-router";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const cameraRef = useRef(null);
  const {loginData, setLoginData}=useContext(MyContext);
  const [debugInfo, setDebugInfo] = useState("");
  const [imageUri, setImageUri]=useState({uri:'http://monsterballgo.com/media/usr/default.png'});



  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          ImageType:'jpg',
          quality:0
        });
        setImage(photo.uri); // Set the image URI to state
      } catch (error) {
        console.log('Error al tomar la foto:', error);
      }
    } else {
      console.log('La cámara aún no está lista');
    }
  };

  const uploadPicture = async () => {
    if (image) {
        try {

          const formData = new FormData();
          formData.append('token', 'code37');
          formData.append('id', loginData.id);
          
          formData.append('image', {
            uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
            name: 'image0ne',
            type: 'image/jpeg'
            });
          console.log(formData.getAll('image'));
      
          console.log("Form data creado");
  
          fetch( Endpoints.SET_PROFILE_PICTURE , {
            method:'POST',
            body:formData
          })
          .then( response=>response.json())
          .then( data => {
            setImageUri({uri:data.pfp_url});
            setDebugInfo( JSON.stringify(data));
            console.log(debugInfo);
            
            })
          .catch( err=>{console.log(err)});
  
        } catch (error) {
          console.log('Error al enviar la imagen:', error);
          alert('Hubo un error al guardar la imagen');
        }
      }
    };

  const handleRetake = () => {
    setImage(null); // Reset the image to retake the picture
  };


  if (image) {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.capturedImage} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRetake}>
            <Text style={styles.text}>Retomar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={uploadPicture}>
            <Text style={styles.text}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={type} pictureSize='640x480'>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Tomar Foto</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width:200,
    height:200
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 20,
  },
  button: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  capturedImage: {
    width: 300, // Ajusta este valor para cambiar el tamaño de la imagen
    height: 400, // Ajusta este valor para cambiar el tamaño de la imagen
    borderRadius: 10,
  },
});
