import CameraRoll from '@react-native-community/cameraroll';

const makePhoto = async ({ camera, nav }) => {
  let photoUri;
  const options = {
    quality: 0.5,
    exif: true,
    skipProcessing: true,
  };
  const makePhoto = await camera.takePictureAsync(options).then((resp) => {
    console.log('SHOT', resp.uri), (photoUri = resp);
  });

  console.log(photoUri);

  const leafsAlbum = await CameraRoll.save(photoUri.uri, { type: 'photo', album: 'Leafs' })
    .then(() =>
      nav('ScanPhoto', {
        img: photoUri,
      }),
    )
    .catch((error) => console.log(error));
};

export default makePhoto;
