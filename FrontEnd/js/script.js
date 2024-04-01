const gallery = document.querySelector(".gallery")
const filterContainer = document.querySelector(".filters-container")
const editProjectGallery = document.querySelector(
	".edit-projects__gallery-grid",
)
const isEditionMode = document.querySelectorAll(".is-edition-mode")
let removeProjectBtn = null // query selector ici pour pouvoir mettre à jours plutard et pour l'instant ils n'existent pas dans le DOM

//---------------------------------------------

let loginToken =
	sessionStorage.loginToken !== undefined ? sessionStorage.loginToken : null

//---------------------------------------------

const isUserLoggedCheck = () => {
	// afficher le mode édition

	if (loginToken) {
		isEditionMode.forEach((item) => {
			item.classList.add("active")
		})

		filterContainer.style = "display: none;"
	}
}

//---------------------------------------------

const getProjects = async () => {
	const url = "http://localhost:5678/api/works"
	const request = "get"
	const projectsData = await crudRequest(url, request)

	extractDataFromApi(projectsData)

	const projects = document.querySelectorAll(".gallery > figure")

	handleFilterSelection(projects)
	removeProjectFromModaleGallery(projects)
}

const removeProjectFromModaleGallery = (projects) => {
	const removeProjectBtn = document.querySelectorAll(".remove-project-btn")

	removeProjectBtn.forEach((button) => {
		button.addEventListener("click", () => {
			const projectId = button.getAttribute("aria-projectid")

			// deleteProjectRequest(projectId) // ici car besoin des removeProjectBtn et des id qui leur sont associé

			// retirer le projet supprimé de la main page
			projects.forEach((project) => {
				if (project.getAttribute("aria-projectid") == projectId) {
					project.remove()
				}
			})
		})
	})
}

const deleteProjectRequest = async (projectId) => {
	const url = `http://localhost:5678/api/works/${projectId}`
	const request = "deleteProject"

	const deleteProjectResponse = await crudRequest(url, request)

	const modalGalleryImages = document.querySelectorAll(
		".modal-gallery-figure",
	)

	//retirer le projet supprimé de la gallerie modale
	modalGalleryImages.forEach((figure) => {
		if (figure.getAttribute("aria-projectid") == projectId) {
			figure.remove()
		}
	})
}

const handleFilterSelection = (projects) => {
	const filters = document.querySelectorAll(".filter")
	// comme je rajoute mes filtres et projets dynamiquement avec
	// js, je les queryselector ici, une fois qu'ils sont
	// tous présent dans le DOM

	filters.forEach((filter, index) => {
		// filtrage des projects en fonction des filtres
		filter.addEventListener("click", () => {
			const filterCategory = filter.getAttribute("category-id")

			//---------------------------------------------

			projects.forEach((project) => {
				// pour chaque projet, si son data-category ne correspond pas au
				// filtre, alors je le display none, s'il est égale à Tous alors
				// tout les projets se mettent en display block

				if (
					project.dataset.category === filterCategory ||
					filterCategory === "Tous"
				) {
					project.style = "display:block"
				} else {
					project.style = "display:none"
				}
			})

			//---------------------------------------------

			//changer background d'un filtre
			filters.forEach((filter) => {
				filter.classList.add("active")
			})

			filter.classList.remove("active")
		})
	})
}

const extractDataFromApi = (data) => {
	let categories = []

	// je parcours le tableau des project
	data.forEach((project) => {
		createProject(project)

		//créer la liste de catégorie
		if (
			categories.every((category) => category.id !== project.category.id)
		) {
			categories.push(project.category)
		}
	})

	//permet de créer les button filtre dynamiquement en js,
	//en prévoyance de l'ajout de nouvelle catégorie dans le futur
	categories.forEach((category) => {
		createFilter(category)
		createModalCategoryOption(category)
	})
}

const createFilter = (category) => {
	const newFilter = document.createElement("button")

	newFilter.classList.add("filter")
	newFilter.classList.add("active")
	newFilter.innerText = category.name
	newFilter.setAttribute("category-id", category.id)

	filterContainer.appendChild(newFilter)
}

const createModalCategoryOption = (category) => {
	const modalSelect = document.querySelector("#category")

	const newOption = document.createElement("option")
	newOption.value = category.id
	newOption.innerText = category.name

	modalSelect.appendChild(newOption)
}

const createProject = async (project) => {
	//--------- cette section est réservé à la gallerie principale -------------

	// je créer tout mes éléments qui vont accueillir
	// mes données
	const newFigure = document.createElement("figure")
	const newImg = document.createElement("img")
	const newFigcaption = document.createElement("figcaption")

	// je rentre les données dans ces nouveaux éléments

	newImg.src = project.imageUrl
	newImg.alt = project.title
	newFigcaption.innerText = project.title

	// nos projets seront sous cette forme: figure > img + figcaption
	// j'ajoute l'img et le figcaption comme nouvel enfant à mon figure
	newFigure.setAttribute("data-category", project.categoryId)
	newFigure.appendChild(newImg)
	newFigure.appendChild(newFigcaption)

	newFigure.setAttribute("aria-projectid", project.id)

	// j'ajoute la figure comme nouvel enfant à notre gallerie
	gallery.appendChild(newFigure)

	//--------- et celle-ci pour la gallerie de la modale -------------

	const modalFigure = document.createElement("figure")
	const modalProjectDelete = document.createElement("button")
	const trashCan = `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
</svg>`

	modalProjectDelete.innerHTML = trashCan
	modalProjectDelete.setAttribute("class", "remove-project-btn")
	modalProjectDelete.addEventListener("click", () => {
		console.log("coucou")
	})
	modalFigure.appendChild(modalProjectDelete)

	const newImgClone = newImg.cloneNode(true) // permet de créer une copie de newImg, évite de dupliquer du code
	modalProjectDelete.setAttribute("aria-projectid", project.id) // ajouter l'id du projet pour pouvoir l'identifier pour le supprimer
	modalFigure.setAttribute("aria-projectid", project.id)
	modalFigure.appendChild(newImgClone)
	modalFigure.setAttribute("class", "modal-gallery-figure")

	editProjectGallery.appendChild(modalFigure)

	// const url = `http://localhost:5678/api/works/${project.id}`
	// const request = "deleteProject"

	// const deleteProjectResponse = await crudRequest(url, request)
}

const logInOutAction = () => {
	const loginLink = document.querySelector("nav > ul > li > .login-link")
	const loginForm = document.querySelector(".login-form")
	const mainSections = document.querySelectorAll(".main-section")
	const navLinks = document.querySelectorAll(".header-bar > nav ul li a")
	const footer = document.querySelector(".footer")

	// naviguer sur les liens
	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (link.textContent === "login") {
				//si on clique sur le lien login
				// la main page diplay none et la page login display block
				mainSections[0].classList.add("active")
				mainSections[1].classList.add("active")
				link.style = "font-weight:600;" // permet de mettre le lien "login" en gras
				footer.classList.add("active")
			} else {
				if (link.textContent === "logout") {
					//si on clique sur logout on retire le token de la session
					// et on force le refesh de la page afin de retrouver la page "public"
					sessionStorage.removeItem("loginToken")

					location.reload()
				}
				mainSections[0].classList.remove("active")
				mainSections[1].classList.remove("active")
				loginLink.style = "font-weight:none;"
				footer.classList.remove("active")
			}
		})
	})

	// fonction d'envoi des données pour se connecter
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault()

		let loginFormData = new Object()

		loginFormData.email = e.target[0].value
		loginFormData.password = e.target[1].value

		loginRequest(loginFormData, mainSections, loginLink, footer)
	})
}

// fonction de connection

const loginRequest = async (formData, mainSections, loginLink, footer) => {
	const url = `http://localhost:5678/api/users/login`
	const request = "login"
	const apiResponse = await crudRequest(url, request, formData)

	if (apiResponse) {
		alert("Connection réussie")
		sessionStorage.setItem("loginToken", apiResponse.token)
		loginToken = apiResponse.token

		isUserLoggedCheck()

		//permet de rediriger vers la page principale
		mainSections[0].classList.remove("active")
		mainSections[1].classList.remove("active")

		loginLink.style = "font-weight:none;" //enlever le font weight du lien login
		footer.classList.remove("active") // fixer le footer en bas
	}
}

//---------------------------------------------

const modalActions = () => {
	// ouvrir ou fermer modal
	// modal permet de gérer les projets

	const toggleModalBtn = document.querySelectorAll(
		".edit-projects__toggle-modale-btn",
	)
	const addPhotoBtn = document.querySelector(".edit-projects__add-photo-btn")
	const backToModalGalleryBtn = document.querySelector(
		".edits-projects__back-to-gallery-btn",
	)

	const editProjectsModal = document.querySelector(".edit-projects__modal")

	const editProjectSection = document.querySelectorAll(
		".edit-projects__section ",
	)

	// ouvrir la modale
	toggleModalBtn.forEach((button) => {
		button.addEventListener("click", () => {
			editProjectsModal.classList.toggle("active") // ouvrir/fermer la modale quand on clique sur "modifier" et "fermer"
			editProjectSection[1].classList.remove("active") // desactiver la section "ajout photo"
			editProjectSection[0].classList.add("active") // activer la section gallerie
			backToModalGalleryBtn.classList.remove("active") // on cache le bouton retour à la gallerie
		})
	})

	// switcher entre les deux section de la modale
	addPhotoBtn.addEventListener("click", () => {
		editProjectSection[0].classList.remove("active") // ferme la gallerie
		editProjectSection[1].classList.add("active") // j'ouvre le formulaire d'ajout
		backToModalGalleryBtn.classList.add("active") // le bouton retour est disponible
	})

	backToModalGalleryBtn.addEventListener("click", () => {
		editProjectSection[0].classList.add("active") // ouvre la gallerie
		editProjectSection[1].classList.remove("active") // fermer le formulaire d'ajout
		backToModalGalleryBtn.classList.remove("active") // retour n'est plus disponible
	})

	// fonction fetch pour envoyer les données

	const newProjectForm = document.querySelector(
		".edit-projects__add-photo-form",
	)

	const addPhotoFormBtn = document.querySelector(
		".add-photo-form__submit-btn",
	)

	// addPhotoFormBtn.removeAttribute("disabled");
	newProjectForm.addEventListener("change", () => {
		// Vérification des champs requis
		const inputs = newProjectForm.querySelectorAll(".required-value")

		const isFormValid = Array.from(inputs).every(
			(input) => input.value.trim() !== "",
		)

		// Activation ou désactivation du bouton en fonction de la validité du formulaire
		if (isFormValid) {
			addPhotoFormBtn.removeAttribute("disabled")
			addPhotoFormBtn.classList.remove("active")
		} else {
			addPhotoFormBtn.setAttribute("disabled", "disabled")
			addPhotoFormBtn.classList.add("active")
		}

		displayChoseImage(newProjectForm)
	})

	newProjectForm.addEventListener("submit", (e) => {
		e.preventDefault()

		const formData = new FormData(e.target)

		postProjectRequest(formData)
	})
}

//---------------------------------------------

const displayChoseImage = (newProjectForm) => {
	const uploadedImage = document.querySelector(
		".add-photo-form__uploaded-image",
	)
	const addImageSpan = document.querySelector(".image-label__span")

	const inputFile = newProjectForm.querySelector("input[type=file]").files

	let fileReader = new FileReader()

	fileReader.onload = (e) => {
		uploadedImage.src = e.target.result
		uploadedImage.classList.add("visible")
		addImageSpan.classList.add("hidden")
	}
	fileReader.readAsDataURL(inputFile[0])
}

const postProjectRequest = async (formData) => {
	const url = `http://localhost:5678/api/works`
	const request = "postProject"

	const addedProject = await crudRequest(url, request, formData)

	createProject(addedProject)
}

//---------------------------------------------

async function crudRequest(url, request, formData = {}) {
	let options = {}

	switch (request) {
		case "postProject":
			options = {
				method: "post",
				headers: {
					Authorization: `Bearer ${loginToken}`,
				},
				body: formData,
			}
			break
		case "getProjects":
			options = {
				method: "get",
				headers: {
					Authorization: `Bearer ${loginToken}`,
				},
			}
			break
		case "deleteProject":
			options = {
				method: "delete",
				headers: {
					Authorization: `Bearer ${loginToken}`,
				},
			}
			break
		case "login":
			options = {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			}
			break
	}

	try {
		const response = await fetch(url, options)

		if (!response.ok) {
			if (response.status === 401 && request === "login") {
				throw new Error("Paire d'identifiant incorrect")
			}
		}
		if (response.status === 204) {
			alert("Projet supprimé avec succès")
			return null
		}
		if (response.status === 201) {
			alert("Projet ajouté avec succès")
		}
		const data = await response.json()
		return data
	} catch (error) {
		alert(error)
	}
}

//---------------------------------------------

const mainFunction = () => {
	isUserLoggedCheck()
	getProjects()
	logInOutAction()
	modalActions()
}

window.addEventListener("load", function () {
	mainFunction()
})
