const AUTH_SERVICE = "http://localhost:7235";
const CHAT_SERVICE = "http://localhost:8080";

const request = (options) => {
//   const headers = new Headers();

//   if (options.setContentType !== false) {
//     headers.append("Content-Type", "application/json");
//   }

//   if (localStorage.getItem("accessToken")) {
//     headers.append(
//       "Authorization",
//       "Bearer " + localStorage.getItem("accessToken")
//     );
//   }

//   const defaults = { headers: headers };
//   options = Object.assign({}, defaults, options);

//   return fetch(options.url, options).then((response) =>
//     response.json().then((json) => {
//       if (!response.ok) {
//         return Promise.reject(json);
//       }
//       return json;
//     })
//   );


};

export function login(loginRequest) {
  return request({
    url: AUTH_SERVICE + "/signin",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

// export function facebookLogin(facebookLoginRequest) {
//   return request({
//     url: AUTH_SERVICE + "/facebook/signin",
//     method: "POST",
//     body: JSON.stringify(facebookLoginRequest),
//   });
// }

export function signup(signupRequest) {
    // signupRequest.append("isNew", true)
    // console.log(signupRequest)
  return request({
    url: AUTH_SERVICE + "/api/Auth/register",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}
