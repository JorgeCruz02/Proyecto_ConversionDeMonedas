import {View, Text, Image, StyleSheet, Pressable, Platform, Button} from "react-native";
import { router } from "expo-router";
import { useState, useRef } from "react";

import { Endpoints } from "@/constants/Endpoints";
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ImageType } from "expo-camera/build/legacy/Camera.types";

export default function Index()
{
	const userIDprueba = 6666

///// con filePicker
const [image, setImage] = useState<string | null>(null);
const [debugInfo, setDebugInfo] = useState("");
const [imageUri, setImageUri]=useState({uri:'http://monsterballgo.com/media/usr/default.png'});
const [permission, requestPermission] = useCameraPermissions();
const cameraRef = useRef<Camera | null>(null); // Camera reference

//////////// con filePicker

const pick = async () => {
	// No permissions request is necessary for launching the image library
	// let result = await ImagePicker.launchImageLibraryAsync({
	//   mediaTypes: ImagePicker.MediaTypeOptions.All,
	//   allowsEditing: true,
	//   aspect: [1, 1],
	//   quality: 1,
	// });
	let result = await ImagePicker.launchCameraAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.All,
		  allowsEditing: true,
		  aspect: [1, 1],
		  quality: 1,
		});

	if (!result.canceled) {
		console.log(result.assets.length);
		setImage(result.assets[0].uri);
		const form = new FormData();
		form.append('token','code37');
		form.append('id', String(userIDprueba));
		console.log(Platform.OS);
		form.append('image', {
			uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
			name: 'image0ne',
			type: 'image/jpeg'
			});
		console.log(form.getAll('image'));

		fetch( Endpoints.SET_PROFILE_PICTURE , {
			method:'POST',
			body:form,
			headers: {
				'Content-Type': 'multipart/form-data',
			  },
		})
		.then( response=>response.json())
		.then( data => {
			setImageUri({uri:data.pfp_url});
			setDebugInfo( JSON.stringify(data));
			console.log(debugInfo);
			
			})
		.catch( err=>{console.log(err)});

	}
};

////// con cámara
	const askPermissions = ()=>
	{
		requestPermission();
	}

	const takePhotoAndUpload = async ()=>
	{
		if(!permission?.granted)
		{
			askPermissions();
		}
		else
		{
			cameraRef.current.takePictureAsync({
				ImageType:'jpg',
				quality:0,

			})
			.then( (picture)=>
			{
				console.log(picture.uri);
				setImage(picture.uri);
				const form = new FormData();
				form.append('token','code37');
				form.append('id', String(userIDprueba));
				console.log(Platform.OS);
				form.append('image', {
					uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
					image_name: 'image0ne',
					type: 'image/jpeg'
					});
				console.log(form.getAll('image'));

				fetch( Endpoints.SET_PROFILE_PICTURE , {
					method:'POST',
					body:form
				})
				.then( response=>response.json())
				.then( data => {
					setImageUri({uri:data.pfp_url});
					setDebugInfo( JSON.stringify(data));
					console.log(debugInfo);
					
					})
				.catch( err=>{console.log(err)});
			}
			)
		}
	}

	return (
		<View style={styles.container}>
			<Text>Prueba de setpfp usando cámara y FilePicker</Text>
			<Text>ID a modificar: {userIDprueba}</Text>
			{permission?.granted? 
			(
				<CameraView style={{width:200,height:200}} 
				facing="back" 
				ref={cameraRef}
				pictureSize="640x480">
				</CameraView>
			):
			(	
				<View>
				<Text>no perms</Text>
				<Button title="Dar permiso" onPress={askPermissions}></Button>
				</View>
			)}
			<View style={styles.botones}>
				<Pressable style={styles.boton} onPress={takePhotoAndUpload}>
					<Text>Foto</Text>
				</Pressable>
				<Pressable style={styles.boton} onPress={pick}>
					<Text>Galería</Text>
				</Pressable>
			</View>
			
			<Text style={{padding:5}} >Resultado:</Text>
			<Image style={{width:120,height:120}} source={imageUri}></Image>
			<Text style={{fontSize:9,fontFamily:'monospace'}}>{debugInfo}</Text>
		</View>
	)
}

const styles=StyleSheet.create({
	container:{
		flex: 1,
		justifyContent:"flex-start",
		alignItems:"center",
		padding:20,
	},
	botones:
	{
		flexDirection:"row",
		padding:5
	},
	boton:
	{
		backgroundColor:'#F9D689',		
		width:120,
		height:35,
		flexDirection:'row',
		alignItems: 'center',
		justifyContent:'center',
		padding:5,
		borderRadius:5,
		borderColor:'#000',
		borderWidth:2,
		marginHorizontal:5
	}
});