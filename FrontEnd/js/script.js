const gallery = document.querySelector(".gallery");
const filterContainer = document.querySelector(".filters-container");
const editProjectGallery = document.querySelector(
	".edit-projects__gallery-grid",
);

let loginToken = sessionStorage.loginToken ? sessionStorage.loginToken : null;
let projectsFromApiData = new Array();

//---------------------------------------------
const isEditionMode = document.querySelectorAll(".is-edition-mode");

const isUserLoggedCheck = () => {
	// afficher le mode édition
	loginToken &&
		isEditionMode.forEach((item) => {
			item.classList.add("active");
		});
};

isUserLoggedCheck();
//---------------------------------------------

const getProjectsFromApi = () => {
	fetch("http://localhost:5678/api/works")
		.then((response) => response.json())
		.then((data) => {
			projectsFromApiData = data;

			let categories = [];

			// je parcours le tableau des project
			data.forEach((project) => {
				createProject(project);

				if (!categories.includes(project.category.name)) {
					categories.push(project.category.name);
				}
			});

			//permet de créer les button filtre dynamiquement en js,
			//en prévoyance de l'ajout de type dans le futur
			categories.forEach((category) => {
				createFilter(category);
			});

			const filters = document.querySelectorAll(".filter");
			const projects = document.querySelectorAll(".gallery > figure");
			// comme je rajoute mes filtres et projets dynamiquement avec
			// js, je les queryselector ici, une fois qu'ils sont
			// tous présent dans le document

			filters.forEach((filter, index) => {
				// filtrage des projects en fonction des filtres
				filter.addEventListener("click", () => {
					const filterCategory = filter.textContent;

					//---------------------------------------------

					projects.forEach((project) => {
						// pour chaque projet, si son data-category ne correspond pas au
						// filtre, alors je le display none, s'il est égale à Tous alors
						// tout les projets se mettent en displayblock
						if (
							project.dataset.category === filterCategory ||
							filterCategory === "Tous"
						) {
							project.style = "display:block";
						} else {
							project.style = "display:none";
						}
					});

					//---------------------------------------------

					filters.forEach((filter) => {
						filter.classList.add("active");
					});

					filter.classList.remove("active");
				});
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

const createProject = (project) => {
	//--------- cette section est réservé à la gallerie principale -------------

	// je créer tout mes éléments qui vont accueillir
	// mes données
	const newFigure = document.createElement("figure");
	const newImg = document.createElement("img");
	const newFigcaption = document.createElement("figcaption");

	// je rentre les données dans ces nouveaux éléments

	newImg.src = project.imageUrl;
	newImg.alt = project.title;
	newFigcaption.innerText = project.title;

	// nos projets seront sous cette forme: figure > img + figcaption
	// j'ajoute l'img et le figcaption comme nouvel enfant à mon figure
	newFigure.setAttribute("data-category", project.category.name);
	newFigure.appendChild(newImg);
	newFigure.appendChild(newFigcaption);

	// j'ajoute la figure comme nouvel enfant à notre gallerie
	gallery.appendChild(newFigure);

	//--------- et celle-ci pour la gallerie de la modale -------------

	const modalFigure = document.createElement("figure");
	const modalProjectDelete = document.createElement("button");
	const trashCan = `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
</svg>`;

	modalProjectDelete.innerHTML = trashCan;
	modalProjectDelete.setAttribute("class", "remove-project-btn");
	modalFigure.appendChild(modalProjectDelete);
	const newImgClone = newImg.cloneNode(true); // permet de créer une copie de newImg, évite de dupliquer du code
	modalProjectDelete.setAttribute("aria-projectid", project.id); // ajouter l'id du projet pour pouvoir l'identifier pour le supprimer
	modalFigure.appendChild(newImgClone);

	editProjectGallery.appendChild(modalFigure);
};

//---------------------------------------------

const createFilter = (category) => {
	const newFilter = document.createElement("button");

	newFilter.classList.add("filter");
	newFilter.classList.add("active");
	newFilter.innerText = category;

	filterContainer.appendChild(newFilter);
};

//---------------------------------------------

const loginAction = () => {
	const loginLink = document.querySelector("nav > ul > :nth-child(3)");
	const sections = document.querySelectorAll("section");
	const loginForm = document.querySelector(".login-form");
	const mainSections = document.querySelectorAll(".main-section");
	const navLinks = document.querySelectorAll(".header-bar > nav ul li a");
	const footer = document.querySelector(".footer");

	// naviguer sur les liens
	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (link.textContent === "login") {
				mainSections[0].classList.add("active");
				mainSections[1].classList.add("active");
				loginLink.style = "font-weight:600;"; // permet de mettre le lien "login" en gras
				footer.classList.add("active");
			} else {
				mainSections[0].classList.remove("active");
				mainSections[1].classList.remove("active");
				loginLink.style = "font-weight:none;";
				footer.classList.remove("active");
			}
		});
	});

	// fonction d'envoi des données pour se connecter
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();

		let loginFormData = new Object();

		loginFormData.email = e.target[0].value;
		loginFormData.password = e.target[1].value;

		loginRequest(loginFormData, mainSections, loginLink, footer);
	});
};

// fonction de connection

const loginRequest = async (formData, mainSections, loginLink, footer) => {
	const loginUrl = `http://localhost:5678/api/users/login`;
	const options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	};

	try {
		const apiResponse = await crudRequest(loginUrl, options);

		if (apiResponse) {
			alert("Connection réussie");
			sessionStorage.setItem("loginToken", apiResponse.token);
			loginToken = apiResponse.token;

			isUserLoggedCheck();

			//permet de rediriger vers la page principale
			mainSections[0].classList.remove("active");
			mainSections[1].classList.remove("active");

			loginLink.style = "font-weight:none;"; //enlever le font weight du lien login
			footer.classList.remove("active"); // fixer le footer en bas
		}
	} catch (error) {
		alert("Erreur dans l’identifiant ou le mot de passe");
	}
};

//---------------------------------------------
//---------------------------------------------

const modalActions = () => {
	// ouvrir ou fermer modal
	// modal permet de gérer les projets

	const toggleModalBtn = document.querySelectorAll(
		".edit-projects__toggle-modale-btn",
	);
	const addPhotoBtn = document.querySelector(".edit-projects__add-photo-btn");
	const editProjectsModal = document.querySelector(".edit-projects__modal");
	const sendNewProjectBtn = document.querySelector(
		".edit-projects__add-photo-form > button",
	);
	const requiredValues = document.querySelectorAll(".required-value");
	const editProjectSection = document.querySelectorAll(
		".edit-projects__section ",
	);

	const backToModalGalleryBtn = document.querySelector(
		".edits-projects__back-to-gallery-btn",
	);

	let newProject = { image: null, title: null, category: null };

	// ouvrir la modale
	toggleModalBtn.forEach((button) => {
		button.addEventListener("click", () => {
			editProjectsModal.classList.toggle("active"); // ouvrir la modale quand on clique sur modifier
			editProjectSection[0].classList.add("active"); // activer la section gallerie
		});
	});

	// switcher entre les deux section de la modale
	addPhotoBtn.addEventListener("click", () => {
		editProjectSection[0].classList.remove("active"); // ferme la gallerie
		editProjectSection[1].classList.add("active"); // j'ouvre le formulaire d'ajout
		backToModalGalleryBtn.classList.add("active");
	});

	backToModalGalleryBtn.addEventListener("click", () => {
		editProjectSection[0].classList.add("active"); // ouvre la gallerie
		editProjectSection[1].classList.remove("active"); // fermer le formulaire d'ajout
		backToModalGalleryBtn.classList.remove("active");
	});

	// permet de récupérer les données entrée
	requiredValues.forEach((input) => {
		const typeValue = input.getAttribute("name");
		const typeInput = input.getAttribute("type");

		if (typeInput === "file") {
			input.addEventListener("change", (e) => {
				const uploadedImage = e.target.files[0];

				newProject[typeValue] = uploadedImage;

				// 	const uploadedImage = document.querySelector(".uploaded-image");
				// 	let loadedImage = e.target.files[0];

				// 	let fileReader = new FileReader();

				// 	// générer l'url correct de l'image chargé
				// 	fileReader.onload = (e) => {
				// 		uploadedImage.src = e.target.result;
				// 	};

				// 	fileReader.readAsDataURL(loadedImage);

				// 	newProject[typeValue] = e.target.files[0];
			});
		} else if (typeInput === "text") {
			input.addEventListener("input", (e) => {
				newProject[typeValue] = e.target.value;
			});
		} else {
			input.addEventListener("change", (e) => {
				newProject[typeValue] = e.target.value;
			});
		}
	});

	// fonction fetch pour envoyer les données

	const newProjectForm = document.querySelector(
		".edit-projects__add-photo-form",
	);

	newProjectForm.addEventListener("submit", (e) => {
		e.preventDefault();
		console.log(newProject);

		fetch("http://localhost:5678/api/works", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${loginToken}`,
			},
			body: JSON.stringify(newProject),
		})
			.then((response) => {
				if (!response.ok) {
					console.log(response);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.log(error);
			});
	});

	// remove project function

	const removeProjectBtn = document.querySelectorAll(".remove-project-btn");
};

//---------------------------------------------

const removeProject = async () => {
	const projectId = 15;

	const deleteUrl = `http://localhost:5678/api/works/${projectId}`;

	const options = {
		method: "delete",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${loginToken}`,
		},
	};

	try {
		const deleteRequest = await crudRequest(deleteUrl, options);
		console.log(deleteRequest);
	} catch (error) {
		alert("Une erreur est survenue");
	}
};

// removeProject();

//---------------------------------------------

async function crudRequest(url, options = {}) {
	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error("Une erreur est survenue lors de la requête.");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Erreur :", error);
		throw error;
	}
}

//---------------------------------------------

const getProjects = async () => {
	try {
		const projectsData = await crudRequest(
			"http://localhost:5678/api/works",
		);

		console.log(projectsData);
	} catch (error) {
		console.log(error);
	}
};

//---------------------------------------------

getProjectsFromApi();
loginAction();
modalActions();
