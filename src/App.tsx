import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ICountry, Keys, favsState, haveBeenState, wannaGoState } from "./atom";
import { useRecoilState } from "recoil";

const Wrapper = styled.main`
  max-width: 320px;
  margin: 0 auto;
`;
const Container = styled.div`
  form {
    input {
      width: 100%;
      box-sizing: border-box;
    }
  }
`;
const Countries = styled.section`
  margin-top: 20px;
`;
const Country = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 20px;
    font-weight: 600;
    margin-right: 10px;
  }
  button {
    font-size: 12px;
    padding: 10px;
  }
`;
const Error = styled.span`
  color: tomato;
  font-weight: 600;
`;

interface IForm {
  name: string;
}

////////

function App() {
  const [wannaGo, setWannaGo] = useRecoilState(wannaGoState);
  const [havebeen, setHaveBeen] = useRecoilState(haveBeenState);
  const [favs, setFavs] = useRecoilState(favsState);

  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onVaild = ({ name }: IForm) => {
    setWannaGo((current) => [{ name: name, id: Date.now() }, ...current]);
    setValue("name", "");
  };

  useEffect(() => {
    localStorage.setItem(Keys.WANNA_GO, JSON.stringify(wannaGo));
    localStorage.setItem(Keys.HAVE_BEEN, JSON.stringify(havebeen));
    localStorage.setItem(Keys.FAVS, JSON.stringify(favs));
  }, [wannaGo, havebeen, favs]);

  const getCountry = (id: number, arr: ICountry[]) =>
    arr.find((country) => country.id === id);
  const deleteCountry = (id: number, arr: ICountry[]) =>
    arr.filter((country) => country.id !== id);
  const addCountry = (country: ICountry, arr: ICountry[]) => [country, ...arr];

  const onCheckClick = (id: number) => {
    const country = getCountry(id, wannaGo);
    if (!country) return;
    setWannaGo((current) => deleteCountry(id, current));
    setHaveBeen((current) => addCountry(country, current));
  };
  const onTrashClick = (id: number) => {
    const country = getCountry(id, wannaGo);
    if (!country) return;
    setWannaGo((current) => deleteCountry(id, current));
  };
  const onLikedClick = (id: number) => {
    const country = getCountry(id, havebeen);
    if (!country) return;
    setHaveBeen((current) => deleteCountry(id, current));
    setFavs((current) => addCountry(country, current));
  };
  const onCancleClick = (id: number) => {
    const country = getCountry(id, havebeen);
    if (!country) return;
    setHaveBeen((current) => deleteCountry(id, current));
    setWannaGo((current) => addCountry(country, current));
  };
  const onDisLikeClick = (id: number) => {
    const country = getCountry(id, favs);
    if (!country) return;
    setFavs((current) => deleteCountry(id, current));
    setHaveBeen((current) => addCountry(country, current));
  };
  console.log(wannaGo);
  return (
    <Wrapper>
      <Container>
        <h2>내가 가고싶은 나라들</h2>
        <form onSubmit={handleSubmit(onVaild)}>
          <input
            {...register("name", { required: "required!" })}
            type="text"
            placeholder="나라 이름"
          />
          <Error></Error>
          <input type="submit" value="가자!" />
        </form>
      </Container>

      <Countries>
        {wannaGo.map((country) => (
          <Country key={country.id}>
            <span>{country.name}</span>
            <button onClick={() => onCheckClick(country.id)}>✅</button>
            <button onClick={() => onTrashClick(country.id)}>🗑️</button>
          </Country>
        ))}
      </Countries>

      <Countries>
        <h2>가본 나라들</h2>
        {havebeen.map((country) => (
          <Country key={country.id}>
            <span>{country.name}</span>
            <button onClick={() => onLikedClick(country.id)}>👍🏻</button>
            <button onClick={() => onCancleClick(country.id)}>❌</button>
          </Country>
        ))}
      </Countries>
      <Countries>
        <h2>좋아하는 나라들</h2>
        {favs.map((country) => (
          <Country key={country.id}>
            <span>{country.name}</span>
            <button onClick={() => onDisLikeClick(country.id)}>👎🏻</button>
          </Country>
        ))}
      </Countries>
    </Wrapper>
  );
}

export default App;
