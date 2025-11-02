class ProductSlider {
    constructor() {
        this.sliders = [];
        this.init();
    }
    
    init() {
        const sliderElements = document.querySelectorAll('.product__slider');
        
        if (sliderElements.length === 0) return;
        
        sliderElements.forEach((slider) => {
            const track = slider.querySelector('.slider__track');
            const slides = slider.querySelectorAll('.slider__slide');
            const dots = slider.querySelectorAll('.slider__dot');
            const thumbnails = slider.closest('.product__gallery')?.querySelectorAll('.product__thumbnail');
            const prevBtn = slider.querySelector('.slider__btn--prev');
            const nextBtn = slider.querySelector('.slider__btn--next');
            
            if (!track || !slides.length || !prevBtn || !nextBtn) return;
            
            const sliderInstance = {
                slider,
                track,
                slides,
                dots,
                thumbnails: thumbnails || [],
                prevBtn,
                nextBtn,
                currentSlide: 0,
                totalSlides: slides.length
            };
            
            prevBtn.addEventListener('click', () => this.prevSlide(sliderInstance));
            nextBtn.addEventListener('click', () => this.nextSlide(sliderInstance));
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(sliderInstance, index));
            });
            
            sliderInstance.thumbnails.forEach((thumbnail, index) => {
                thumbnail.addEventListener('click', () => this.goToSlide(sliderInstance, index));
            });
            
            this.updateSlider(sliderInstance);
            this.sliders.push(sliderInstance);
        });
    }
    
    prevSlide(instance) {
        instance.currentSlide = (instance.currentSlide - 1 + instance.totalSlides) % instance.totalSlides;
        this.updateSlider(instance);
    }
    
    nextSlide(instance) {
        instance.currentSlide = (instance.currentSlide + 1) % instance.totalSlides;
        this.updateSlider(instance);
    }
    
    goToSlide(instance, index) {
        instance.currentSlide = index;
        this.updateSlider(instance);
    }
    
    updateSlider(instance) {
        const translateX = -instance.currentSlide * 25;
        instance.track.style.transform = `translateX(${translateX}%)`;
        
        instance.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === instance.currentSlide);
        });
        
        instance.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === instance.currentSlide);
        });
        
        instance.thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === instance.currentSlide);
        });
    }
}

class TabsManager {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tabs__button');
        this.tabPanels = document.querySelectorAll('.tabs__panel');
        
        if (this.tabButtons.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        this.tabButtons.forEach(button => {
            button.classList.remove('tabs__button--active');
        });
        
        this.tabPanels.forEach(panel => {
            panel.classList.remove('tabs__panel--active');
        });
        
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        const activePanel = document.getElementById(tabId);
        
        if (activeButton && activePanel) {
            activeButton.classList.add('tabs__button--active');
            activePanel.classList.add('tabs__panel--active');
        }
    }
}

class ProductOptions {
    constructor() {
        this.optionValues = document.querySelectorAll('.option__value');
        this.addonCheckboxes = document.querySelectorAll('.addon__checkbox');
        this.memoryItems = document.querySelectorAll('.memory-price__item');
        this.priceElement = document.querySelector('.price__current');
        this.basePrice = 179990;
        
        this.init();
    }
    
    init() {
        this.optionValues.forEach(option => {
            option.addEventListener('click', () => {
                const parent = option.closest('.option');
                const siblings = parent.querySelectorAll('.option__value');
                
                siblings.forEach(sibling => {
                    sibling.classList.remove('option__value--active');
                });
                
                option.classList.add('option__value--active');
            });
        });
        
        this.addonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updatePrice();
            });
        });
        
        this.memoryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.selectMemory(item);
            });
        });
    }
    
    selectMemory(selectedItem) {
        this.memoryItems.forEach(item => {
            item.classList.remove('memory-price__item--active');
        });
        
        selectedItem.classList.add('memory-price__item--active');
        
        const price = selectedItem.getAttribute('data-price');
        if (price && this.priceElement) {
            this.basePrice = parseInt(price);
            this.updatePrice();
        }
    }
    
    updatePrice() {
        let totalPrice = this.basePrice;
        
        this.addonCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const priceText = checkbox.closest('.addon__item').querySelector('.addon__price').textContent;
                const price = parseInt(priceText.replace(/[^\d]/g, ''));
                if (!isNaN(price)) {
                    totalPrice += price;
                }
            }
        });
        
        this.priceElement.textContent = `${totalPrice.toLocaleString()} ₽`;
    }
}

class ProductCarousel {
    constructor() {
        this.swipers = [];
        this.init();
    }
    
    init() {
        const mainSwiperEl = document.querySelector('.product__swiper--main');
        const thumbnailsEl = document.getElementById('productThumbnails');
        
        if (mainSwiperEl && thumbnailsEl) {
            const thumbnailsSwiper = new Swiper(thumbnailsEl, {
                spaceBetween: 10,
                slidesPerView: 4,
                freeMode: true,
                watchSlidesProgress: true,
            });
            
            const mainSwiper = new Swiper(mainSwiperEl, {
                loop: true,
                spaceBetween: 10,
                navigation: {
                    nextEl: mainSwiperEl.querySelector('.swiper-button-next'),
                    prevEl: mainSwiperEl.querySelector('.swiper-button-prev'),
                },
                pagination: {
                    el: mainSwiperEl.querySelector('.swiper-pagination'),
                    clickable: true,
                },
                thumbs: {
                    swiper: thumbnailsSwiper,
                },
                touchRatio: 1,
                touchAngle: 45,
                grabCursor: true,
                effect: 'slide',
                speed: 300,
                on: {
                    init: function() {
                        this.el.style.opacity = '1';
                    }
                }
            });
            
            this.swipers.push(mainSwiper, thumbnailsSwiper);
        } else {
            const swiperElements = document.querySelectorAll('.product__swiper:not(.product__swiper--main)');
            
            if (swiperElements.length === 0) return;
            
            swiperElements.forEach((element) => {
                const swiper = new Swiper(element, {
                    loop: true,
                    loopedSlides: 3,
                    navigation: {
                        nextEl: element.querySelector('.swiper-button-next'),
                        prevEl: element.querySelector('.swiper-button-prev'),
                    },
                    pagination: {
                        el: element.querySelector('.swiper-pagination'),
                        clickable: true,
                        dynamicBullets: true,
                    },
                    touchRatio: 1,
                    touchAngle: 45,
                    grabCursor: true,
                    preventClicks: false,
                    preventClicksPropagation: false,
                    effect: 'slide',
                    speed: 300,
                    spaceBetween: 0,
                    slidesPerView: 1,
                    centeredSlides: false,
                    watchSlidesProgress: true,
                    allowTouchMove: true,
                    resistance: true,
                    resistanceRatio: 0.85,
                    on: {
                        init: function() {
                            this.el.style.opacity = '1';
                        }
                    }
                });
                
                this.swipers.push(swiper);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductSlider();
    new TabsManager();
    new ProductOptions();
    new ProductCarousel();
});
