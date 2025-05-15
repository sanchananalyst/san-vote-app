import Navbar from '../components/Navbar';
import DesignGallery from '../components/DesignGallery';

export default function AllPage() {
  return (
    <>
      <Navbar active="all" />
      <DesignGallery section="all" />
    </>
  );
}