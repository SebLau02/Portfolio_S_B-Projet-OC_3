const gallery = document.querySelector(".gallery");
const filterContainer = document.querySelector(".filters-container");
const editProjectGallery = document.querySelector(
	".edit-projects__projects-photos-container",
);

//---------------------------------------------

const getProjectsFromApi = () => {
	fetch("http://localhost:5678/api/works")
		.then((response) => response.json())
		.then((data) => {
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

	modalFigure.appendChild(modalProjectDelete);
	modalFigure.appendChild(newImg);

	editProjectGallery.appendChild(modalFigure);
};

const createFilter = (category) => {
	const newFilter = document.createElement("button");

	newFilter.classList.add("filter");
	newFilter.classList.add("active");
	newFilter.innerText = category;

	filterContainer.appendChild(newFilter);
};

getProjectsFromApi();

//---------------------------------------------

const loginAction = () => {
	const loginLink = document.querySelector("nav > ul > :nth-child(3)");
	const sections = document.querySelectorAll("section");
	const loginForm = document.querySelector(".login-form");
	const formInputs = document.querySelectorAll(".login-form > label > input");

	const formData = { email: null, password: null };
	let loginToken = sessionStorage.loginToken
		? sessionStorage.loginToken
		: null;

	// permet de mettre le lien "login" en gras
	loginLink.addEventListener("click", () => {
		loginLink.style = "font-weight:600;";

		sections.forEach((section) => {
			section.classList.add("active");

			if (section.getAttribute("id") !== "login-page") {
				section.style = "display:none";
			}
		});
	});

	// récupérer les info d'authentification
	formInputs.forEach((input) => {
		input.addEventListener("input", (e) => {
			if (input.getAttribute("type") === "email") {
				formData.email = e.target.value;
			} else {
				formData.password = e.target.value;
			}
		});
	});

	// fonction d'envoi des données pour se connecter
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();

		fetch("http://localhost:5678/api/users/login", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => {
				if (!response.ok) {
					alert("Paire identifiant incorrect");
				}
				return response.json();
			})
			.then((data) => {
				if (data.token) {
					alert("Connection réussie");
					sessionStorage.setItem("loginToken", data.token);

					sections.forEach((section) => {
						section.classList.remove("active");

						if (section.getAttribute("id") !== "login-page") {
							section.style = "display:null";
						}
					});
				}
			})
			.catch((error) => {
				alert("Une erreur est survenue");
			});
	});
};

loginAction();

//---------------------------------------------

const toggleModalAction = () => {
	// ouvrir ou fermer modal
	// modal permet de gérer les projets
};
