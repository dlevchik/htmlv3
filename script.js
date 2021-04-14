// SETTINGS
const sliderChangeInterval = 4000;      //[ms]interval to change slider slides automatically
const sliderAnimateTime    = 500;       //[ms]time the slider fade animation will last
const sliderWaitTime       = 12;        //[seconds]time slider will wait to change after user interraction
const modalFadeTime        = 300;       //[ms]time the modal fade animation will last
//=========================================================================================

const feedbackForm = $("#feedback-form");
const modal        = $("#feedback");
modal.hide();
let name           = feedbackForm[0].elements.name;
let number         = feedbackForm[0].elements.number;
let email          = feedbackForm[0].elements.email;

const slider       = $("#slider");
let sliderLeft     = $("#slider-left");
let sliderRight    = $("#slider-right");
let slides         = $("#slider .slider-element").toArray();
let currentSlide   = 0;
let lastInteractionTime = undefined;
initSlider();

class ValidationError{
    constructor(message, element, type = "BasicError"){
        this.message = message;
        this.element = element;
        this.type    = type;
        
        let priority;

        switch (type) {
            case "EmptyField":
                priority = 1;    
            break;
        
            case "BasicError":
                priority = 2;    
            break;
        }

        this.priority = priority;
    }
}

$(document).ready(()=>{

    $("#openModal").click((event)=>{
        event.preventDefault();

        openModal();
    });

    $("#close").click((event)=>{
        event.preventDefault();

        closeModal();
    })

    feedbackForm.submit((event)=>{
        clearErrors();
        displayErrors(validateFeedback(event));
    });
});




function initSlider() {
    slides.forEach(element => {
        $(element).hide(0);
    });

    showSlider(0);

    $("#slider-left").click(()=>{
        previousSlide();
        lastInteractionTime = Date.now();
    });
    $("#slider-right").click(()=>{
        nextSlide();
        lastInteractionTime = Date.now();
    });

    setInterval(()=>{
        if(!lastInteractionTime || new Date(Date.now() - lastInteractionTime).getSeconds() >= sliderWaitTime){
            nextSlide();
            lastInteractionTime = undefined;
        }
    }, sliderChangeInterval);
}

function showSlider(slideNumber) {
    slide = $(slides[slideNumber]);
    slide.show({complete: slide.fadeIn(sliderAnimateTime), duration:0});
}

function hideSlider(slideNumber){
    slide = $(slides[slideNumber]);
    slide.hide({complete: slide.fadeOut(sliderAnimateTime), duration:0});
}

function nextSlide(){
    hideSlider(currentSlide);
    currentSlide++;
    
    if(currentSlide > slides.length - 1) currentSlide = 0;
    
    setTimeout(() => {
        showSlider(currentSlide);
    }, sliderAnimateTime);
}

function previousSlide(){
    hideSlider(currentSlide);
    currentSlide--;
    
    if(currentSlide < 0) currentSlide = slides.length - 1;
    
    setTimeout(() => {
        showSlider(currentSlide);
    }, sliderAnimateTime);
}

function openModal(){
    $(document.body).addClass("modal-opened");

    modal.show({complete: modal.fadeIn(modalFadeTime), duration:0});
}

function closeModal(){
    $(document.body).removeClass("modal-opened");

    modal.hide({complete: modal.fadeOut(modalFadeTime), duration:0});
}

function clearErrors(){
    let formElements = [name, number, email];

    formElements.forEach(element => {
        $(element).removeClass("error");
        $(element).attr("placeholder", "");
        $(element.nextElementSibling).html("");
    });
}

function validateFeedback(e){
    let errors = new Array();

    //Name validation

    if(!name.value.length) errors.push(new ValidationError("Имя обезательно для заполнения", name, "EmptyField"));
    if(name.value.length >= 48) errors.push(new ValidationError("Слишком большое имя", name));
    
    //Number validation

    if(!number.value.length) errors.push(new ValidationError("Телефон обезателен для заполнения", number, "EmptyField"));
    if(!number.value.match(/^^\+?3?8?(0\d{9})$/g)) errors.push(new ValidationError("Неправильный формат номера телефона", number));

    //Email validation

    if(!email.value.length) errors.push(new ValidationError("Email обезателен для заполнения", email, "EmptyField"));
    if(!email.value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)) errors.push(new ValidationError("Неправильный формат Email", email));
    
    if(errors.length){
        e.preventDefault();
        return errors;
    }
}

function displayErrors(errors){
    if(!errors) return;

    errors.forEach(e => {
        $(e.element).addClass("error");

        if(e.priority == 1){
            $(e.element).attr("placeholder", e.message);
        }

        if(e.priority == 2 && !$(e.element).attr("placeholder")){
            $(e.element.nextElementSibling).append(`<li>${e.message}</li>`);
        }
    });
}