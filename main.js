const generateForm = document.querySelector(".generate-form")
const imageGallery = document.querySelector(".image-gallery")
const OPENAI_API_KEY = "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"

updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imageObject,index) => {
        const imgCard = imageGallery.querySelector(".img-card")[index];
        const imageElement = imgCard.querySelector("img");

        const aiGeneratedImg = `data:image/jpeg;base64,${imageObject.b64_json}`
        imageElement.src = aiGeneratedImg;

        imageElement.onload = ()=> {
            imgCard.classList.remove("loding");
        }
    }); 

}

const generateAiImages = async (userPrompt,userImageQuantity) => {
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt:userPrompt,
                n:parseInt(userImageQuantity),
                size:"512x512",
                response_format:"b64_json"
            })

        }) 
        if(!response.ok) throw new Error("Faild to generate images! please try agin")
        const {data} = await response.json();
        updateImageCard([...data])
    }catch(error){
        alert(error.message)
    }
}


const handleFormSubmission = (e) => {
    e.preventDefault();

    const userPrompt = e.srcElement[0].value;
    const userImageQuantity = e.srcElement[1].value;
    
    const imagCardMarkup = Array.from({length:userImageQuantity},()=>
        ` <div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn" >
            <img src="images/download.svg" alt="download icon">
        </a>
          </div>
        `
    ).join("")
    
    imageGallery.innerHTML = imagCardMarkup;
    generateAiImages(userPrompt ,userImageQuantity);



}


generateForm.addEventListener("submit",handleFormSubmission)