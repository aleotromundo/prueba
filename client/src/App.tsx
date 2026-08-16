import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { CosmicScene } from "./components/CosmicScene";
import { ThemeProvider } from "./contexts/ThemeContext";
import Guide from "./pages/Guide";
import Home from "./pages/Home";
import Ascendant from "./pages/Ascendant";
import NatalChart from "./pages/NatalChart";
import NotFound from "./pages/NotFound";
import SolarReturn from "./pages/SolarReturn";
import Synastry from "./pages/Synastry";
import Transits from "./pages/Transits";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/carta-natal" component={NatalChart} />
    <Route path="/sinastria" component={Synastry} />
    <Route path="/transitos" component={Transits} />
    <Route path="/retorno-solar" component={SolarReturn} />
    <Route path="/ascendente" component={Ascendant} />
    <Route path="/guia" component={Guide} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><CosmicScene /><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
