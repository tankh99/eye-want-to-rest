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



