import secureLocalStorage from "react-secure-storage";

export default function authHeader() {
    const userStr = secureLocalStorage.getItem("user");
    console.log("user: "+userStr);
    let user = null;
    if (userStr)
      user = JSON.parse(userStr as string);
  
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return { Authorization: '' };
    }
}