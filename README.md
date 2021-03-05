## PWA offline notes

https://pwa-offline-notes.herokuapp.com

## Demo video
[![](http://img.youtube.com/vi/h66GsbuojRM/0.jpg)](http://www.youtube.com/watch?v=h66GsbuojRM "PWA offline notes")

## Features

- offline-first approach (IndexedDB, Cache API, Service worker)
- incremental synchronization
- ability to install app (PWA)
- sharing notes with registered users (read-only, realtime via websockets)
- native notifications (webpush)
- ordinary register flow (email, activation)
- third party auth providers (google, facebook)
- linking existing account with TP auth providers
- animated masonry grid for notes (w/o any third-party libraries)
- snackbar notification when there's a new version of the app available
- JWT access and refresh tokens

## Used technologies and libs

### Client:

- Typescript
- React, redux, thunk, reselect
- IDB
- socket.io
- Create React App (modified config)
- Workbox plugin (inject manifest)
- Service Worker
- Material UI
- Formik
- React beautiful dnd

### Server:

- Typescript
- Express
- Mongoose
- socket.io
- Passport
- Ejs (for third-party auth providers authentication flow)
