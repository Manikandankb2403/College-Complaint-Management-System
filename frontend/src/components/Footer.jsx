const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} College Complaint Portal. All rights reserved.</p>
        <p>Developed by Manikandan K.B.</p>
      </div>
    </footer>
  );
};

export default Footer;