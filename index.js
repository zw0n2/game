const pokemonImg = document.querySelector(".character-image");
const pokemonName = document.querySelector(".character-name");
const button = document.querySelector(".draw-button");
const pokeball = document.querySelector(".pokeball");
const pokemonNumber = document.querySelector(".pokemon-number");

async function loadPokemon(pokemonId) {
  // 1.5초 대기
  const wait = new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
  await wait;

  // 한국어 이름 가져오기
  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`,
  );

  if (!speciesResponse.ok) {
    throw new Error(
      `Species API 호출 실패 (Status: ${speciesResponse.status})`,
    );
  }

  const speciesJson = await speciesResponse.json();
  const koreanName = speciesJson.names.find(
    (name) => name.language.name === "ko",
  );

  if (!koreanName) {
    throw new Error("한국어 이름을 찾을 수 없습니다.");
  }

  // 이미지가 로드된 후 화면에 표시
  pokemonImg.onload = () => {
    pokeball.classList.add("hidden");
    pokemonImg.classList.remove("hidden");
    pokemonImg.classList.add("show");

    const formattedId = pokemonId.toString().padStart(3, "0");
    pokemonNumber.innerText = `#${formattedId}`;
    pokemonImg.alt = koreanName.name;
    pokemonName.innerText = koreanName.name;
  };

  pokemonImg.onerror = () => {
    console.error("포켓몬 이미지를 불러오지 못했습니다.");
    pokeball.classList.add("hidden");
    pokemonImg.classList.add("hidden");
    pokemonName.innerText = "이미지를 불러오지 못했습니다.";
  };

  // 이미지 주소 설정
  pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

async function drawPokemon() {
  // 초기 화면
  pokeball.classList.remove("hidden");
  pokeball.classList.remove("shake");

  pokemonImg.classList.add("hidden");
  pokemonImg.classList.remove("show");

  pokemonName.innerText = "포켓몬을 뽑는 중...";

  // 포켓볼 흔들기 애니메이션 다시 실행
  void pokeball.offsetWidth;
  pokeball.classList.add("shake");

  const pokemonId = Math.floor(Math.random() * 151) + 1;

  try {
    await loadPokemon(pokemonId);
  } catch (error) {
    console.error("포켓몬을 불러오는 중 오류 발생:", error);

    pokeball.classList.add("hidden");
    pokemonImg.classList.add("hidden");
    pokemonName.innerText = "에러가 발생했습니다.";
    return;
  }
}

button.addEventListener("click", drawPokemon);
