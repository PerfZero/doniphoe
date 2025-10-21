class ProductSlider {
    constructor() {
        this.slider = document.querySelector('.product__slider');
        this.track = document.querySelector('.slider__track');
        this.slides = document.querySelectorAll('.slider__slide');
        this.dots = document.querySelectorAll('.slider__dot');
        this.thumbnails = document.querySelectorAll('.product__thumbnail');
        this.prevBtn = document.querySelector('.slider__btn--prev');
        this.nextBtn = document.querySelector('.slider__btn--next');
        
        if (!this.slider) return;
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    updateSlider() {
        const translateX = -this.currentSlide * 25;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentSlide);
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
        const swiperElements = document.querySelectorAll('.product__swiper');
        
        if (swiperElements.length === 0) return;
        
        swiperElements.forEach((element, index) => {
            const swiper = new Swiper(element, {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                touchRatio: 1,
                touchAngle: 45,
                grabCursor: true,
                effect: 'slide',
                speed: 300,
                spaceBetween: 0,
                slidesPerView: 1,
                centeredSlides: true,
                watchSlidesProgress: true,
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

document.addEventListener('DOMContentLoaded', () => {
    new ProductSlider();
    new TabsManager();
    new ProductOptions();
    new ProductCarousel();
});
