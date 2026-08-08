const body = document.body
const themeToggle = document.getElementById("themeToggle")
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.getElementById("nav-menu")

// Light/Dark Theme Toggle
const applyTheme = (theme, persist = true) => {
  body.setAttribute("data-theme", theme)
  themeToggle?.setAttribute("aria-pressed", theme === "dark")
  if (persist) {
    localStorage.setItem("theme-preference", theme)
  }
}

const storedTheme = localStorage.getItem("theme-preference")
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
applyTheme(storedTheme || (prefersDark ? "dark" : "light"), false)

themeToggle?.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const nextTheme = currentTheme === "dark" ? "light" : "dark"
  applyTheme(nextTheme)
})

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  if (!localStorage.getItem("theme-preference")) {
    applyTheme(event.matches ? "dark" : "light", false)
  }
})

// Header scroll effect, back to top, and scroll progress bar
window.addEventListener("scroll", () => {
  const header = document.getElementById("header")
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }

  // Back to top button
  const backToTop = document.querySelector(".back-to-top")
  if (window.scrollY > 300) {
    backToTop.classList.add("active")
  } else {
    backToTop.classList.remove("active")
  }

  // Scroll Progress Bar
  const scrollProgress = document.getElementById("scrollProgress")
  if (scrollProgress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100
      scrollProgress.style.width = `${progress}%`
    }
  }
})

// Mobile menu toggle
menuToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll("#nav-menu ul li a")
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
  })
})


// Typewriter Effect (Hero Title Subtitle)
const typedTextSpan = document.getElementById("typed-text")
const words = ["Full-Stack Developer", "React Developer", "Java Programmer", "UI Enthusiast"]
let wordIndex = 0
let charIndex = 0
let isDeleting = false

const type = () => {
  if (!typedTextSpan) return
  
  const currentWord = words[wordIndex]
  if (isDeleting) {
    charIndex--
  } else {
    charIndex++
  }

  typedTextSpan.textContent = currentWord.substring(0, charIndex)

  let typeSpeed = isDeleting ? 30 : 80

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 2000 // Pause at the end of the word
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    wordIndex = (wordIndex + 1) % words.length
    typeSpeed = 600 // Pause before starting the next word
  }

  setTimeout(type, typeSpeed)
}

document.addEventListener("DOMContentLoaded", () => {
  if (typedTextSpan) {
    setTimeout(type, 1000)
  }
})

// Animated Counters for Statistics Section
const statNumbers = document.querySelectorAll(".stat-number")
const animateStats = () => {
  statNumbers.forEach((num) => {
    const target = parseInt(num.getAttribute("data-target"), 10)
    const duration = 1600 // ms duration
    const stepTime = Math.max(Math.floor(duration / target), 12)
    let current = 0

    const timer = setInterval(() => {
      // Linear growth factor
      current += Math.ceil(target / (duration / stepTime))
      if (current >= target) {
        if (target === 8) {
          num.textContent = "8+"
        } else if (target === 150) {
          num.textContent = "150+"
        } else {
          num.textContent = target
        }
        clearInterval(timer)
      } else {
        num.textContent = current
      }
    }, stepTime)
  })
}

if (statNumbers.length) {
  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats()
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.25 }
  )

  const statsSection = document.getElementById("stats-focus")
  if (statsSection) statsObserver.observe(statsSection)
}

// Project Horizontal Carousel Controls
const carousel = document.getElementById("portfolioCarousel")
const prevBtn = document.getElementById("carouselPrev")
const nextBtn = document.getElementById("carouselNext")

if (carousel) {
  const getScrollOffset = () => {
    // Dynamically calculate scroll step based on screen sizes
    if (window.innerWidth <= 576) {
      return carousel.clientWidth // full width on mobile
    } else {
      return 410 // card width + gap (380 + 30)
    }
  }

  prevBtn?.addEventListener("click", () => {
    carousel.scrollBy({ left: -getScrollOffset(), behavior: "smooth" })
  })

  nextBtn?.addEventListener("click", () => {
    carousel.scrollBy({ left: getScrollOffset(), behavior: "smooth" })
  })
  
  // Carousel Button Visibility Toggler
  const toggleCarouselButtons = () => {
    if (prevBtn && nextBtn) {
      if (carousel.scrollLeft <= 5) {
        prevBtn.style.opacity = "0.3"
        prevBtn.style.pointerEvents = "none"
      } else {
        prevBtn.style.opacity = "1"
        prevBtn.style.pointerEvents = "auto"
      }

      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollHeight - 5) {
        // scrollLeft + clientWidth is close to scrollWidth
        const isEnd = Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth - 10
        nextBtn.style.opacity = isEnd ? "0.3" : "1"
        nextBtn.style.pointerEvents = isEnd ? "none" : "auto"
      }
    }
  }

  carousel.addEventListener("scroll", toggleCarouselButtons)
  window.addEventListener("resize", toggleCarouselButtons)
  // Initial run
  setTimeout(toggleCarouselButtons, 500)
}

// Scroll reveal animations
const revealElements = document.querySelectorAll(".reveal")
if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  )

  revealElements.forEach((el) => revealObserver.observe(el))
}

// Active nav link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll("#nav-menu ul li a")

  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    if (window.scrollY >= sectionTop - 250) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Web3Forms Integration (Success/Error Message Handling via Fetch)
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm")
  const formStatus = document.getElementById("formStatus")

  const updateStatus = (state, message) => {
    if (!formStatus) return
    formStatus.textContent = message
    formStatus.className = state ? `form-status ${state}` : "form-status"
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault()

      // Prevent sending if placeholder key is still there
      const accessKeyInput = contactForm.querySelector('input[name="access_key"]')
      if (accessKeyInput && accessKeyInput.value === "YOUR_ACCESS_KEY_HERE") {
        updateStatus("error", "Error: Please set your Web3Forms Access Key in index.html.")
        return
      }

      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.disabled = true
      submitBtn.textContent = "Sending..."
      updateStatus("", "Sending message...")

      const formData = new FormData(contactForm)
      const object = Object.fromEntries(formData)
      const json = JSON.stringify(object)

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      })
        .then(async (response) => {
          let res = await response.json()
          if (response.status === 200) {
            updateStatus("success", "Message sent successfully! I will get back to you soon.")
            contactForm.reset()
          } else {
            console.log(response)
            updateStatus("error", res.message || "Failed to send message. Please email me directly at premkanthks@gmail.com")
          }
        })
        .catch((error) => {
          console.log(error)
          updateStatus("error", "Something went wrong. Please email me directly at premkanthks@gmail.com")
        })
        .finally(() => {
          submitBtn.disabled = false
          submitBtn.textContent = originalText
        })
    })
  }
})
