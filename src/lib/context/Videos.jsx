// async function add(video) {
//   try {
//     const response = await databases.createDocument(
//       COURSES_DATABASE_ID,
//       VIDEOS_COLLECTION_ID,
//       ID.unique(),
//       video
//     );
//     setVideos((videos) => [response, ...videos].slice(0, 10));
//     return response;
//   } catch (err) {
//     console.log(err); // handle error or show user a message
//   }
// }

// async function remove(id) {
//   try {
//     await databases.deleteDocument(
//       COURSES_DATABASE_ID,
//       VIDEOS_COLLECTION_ID,
//       id
//     );
//     setVideos((videos) => videos.filter((video) => video.$id !== id));
//   } catch (err) {
//     console.log(err);
//   }
// }
