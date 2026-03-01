import "./Home.css";
import Feed from "../../components/Feed/Feed";
import Sidebar from "../../components/Sidebar/Sidebar";

function Home() {
    return (<>
        <div className="home">
            <Sidebar />
            <Feed />
        </div>
    </>);
}

export default Home;