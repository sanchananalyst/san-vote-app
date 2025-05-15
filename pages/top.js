import Navbar from '../components/Navbar';
import DesignGallery from '../components/DesignGallery';

export default function TopPage() {
  return (
    <>
      <Navbar active="top" />
      <DesignGallery section="top-all" />
    </>
  );
}
