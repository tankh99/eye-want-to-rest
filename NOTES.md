# Updating Application
Run the following commands to build and then to update the app
```
eas build
eas submit
```

# Building expo dev client
eas device:create
eas build --profile development --platform ios

Download the profile given in the QR code
then run 
`expo start --dev-client`


# Google Service Account file
You access the google service account in Google Cloud. Select the project you want to link to, in this case it's Eye Want to Rest. Then in the top-left menu, click on IAM and Admin > Service Accounts. Select the first service account.

Go to keys, create a new key iF you're on a new device. Keep the downloaded key JSON file in the credentials folder and link the file's path.

To build an Android APK ```eas build -p android --profile preview```

# Publishing
For Android, you must increment the versionCode property inside app.json each time you make an update. The version code must be an integer, not a string nor a float.

### Designing Screenshots
Guide: https://hotpot.ai/blog/app-store-screenshot-sizes

Panoramic Screenshots (objects bleed into the next image) Guide: 
https://www.storemaven.com/academy/design-panoramic-screenshot-app-store/

### Privacy Policy
I used termsfeed to generate and host a privacy policy for me
Privacy Policy URL: https://www.termsfeed.com/live/9fa8f4aa-b547-48f3-8764-2fb17b7d8be4
Admin URL: https://app.termsfeed.com/download/9fa8f4aa-b547-48f3-8764-2fb17b7d8be4
Guide URL: https://www.termsfeed.com/blog/ios-apps-privacy-policy/#How_To_Create_A_Privacy_Policy_For_Your_Mobile_App


### Troubleshooting
#### Jest
Running tests may sometimes run into import errors, in which case you must go to package.json, under jest.transformIgnorePatterns and add into the regex the library name that's causing you this error

#### Other Issues
- Datetimepicker does not render correctly if it is under a view with the style 'items-center'
- useSharedvalue holds state between state resets. You must reload Expo manually in order to see the changes

# Learning Points:
1. .env is merged into the app when building. Do not store secrets inside .env!