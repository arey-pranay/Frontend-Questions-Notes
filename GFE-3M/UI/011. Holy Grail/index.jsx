export default function App() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      textAlign: "center"
    }}>
      <header style={{
        height: "20%"
      }}>Header</header>
      <div style={{
        display:"flex",
        width: "100%",
        backgroundColor: "black",
        height: "60%"
      }}>
        <nav style={{
          width: "25%"
        }}>Navigation</nav>
        <main style={{
          width: "50%"
        }}
        >Main</main>
        <aside style={{
          width: "25%"
        }}
        >Sidebar</aside>
      </div>
      <footer
      style={{
        height: "20%"
      }}
      >Footer</footer>
    </div>
  );
}
