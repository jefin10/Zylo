export const getUserImageSrc = imagePath =>{
    if(imagePath){
        return {url: imagePath}
    }
    else{
        return require ("@/assets/images/person.jpg")
    }

}