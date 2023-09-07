import AgeGroupPriceList from "./components/AgeGroupPriceList";
import styles from "./App.module.css";

function App() {
  return (
    <main className={styles["main-container"]}>
      <div className={styles["age-group-price-list"]}>
        <AgeGroupPriceList onChange={(result) => console.log(result)} />
      </div>
    </main>
  );
}

export default App;
