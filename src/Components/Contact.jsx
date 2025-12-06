function Contact() {
  return (
    <div className="page-section fade-in">
      <h2 className="section-title">Contact Us 📞</h2>

      <form className="contact-form col-md-6 mx-auto mt-4">
        
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Your Name"
          required
        />

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          required
        />

        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Message"
          required
        ></textarea>

        <button className="btn btn-success w-100">Send Message</button>

      </form>
    </div>
  );
}

export default Contact;
