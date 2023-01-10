import React from "react";
import { Formik } from "formik";
import { markdownify } from "@lib/utils/textConverter";
import emailjs from "@emailjs/browser";

const Contact = ({ data }) => {
  const form = React.useRef();
  const [alert, setAlert] = React.useState({ message: "", type: "" });
  const { frontmatter } = data;
  const { title, info } = frontmatter;

  const renderAlert = () =>(
    <div className={`bg-${alert.type === "success" ? "emerald-300 border-emerald-400 text-white-700" : "red-100 border-red-400 text-red-700"} border px-4 py-3 rounded relative`} role="alert">
      <span className="block sm:inline">{alert.message}</span>
      <span 
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={() => setAlert({ message: "", type: "" })}
      >
        <svg 
          className={`fill-current h-6 w-6 ${alert.type === "success" ? "text-emerald-500" : "text-red-500"}`}
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
      </span>
    </div>
  );

  return (
    <section className="section">
      <div className="container">
        {alert.message && alert.type && renderAlert()}
        {markdownify(title, "h1", "text-center font-normal")}
        <div className="section row pb-0">
          <div className="col-12 md:col-6 lg:col-7">
            <Formik
              initialValues={{ name: "", email: "", subject: "", message: "" }}
              validate={values => {
                const errors = {};

                if (!values.email) {
                  errors.email = 'Required';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }

                if (!values.message) {
                  errors.message = 'Required';
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting, resetForm }, errors) => {

                if (!values.email || !values.message || errors?.email || errors?.message) {
                  return;
                }

                try {
                  await emailjs.sendForm(
                    process.env.SERVICE_ID,
                    process.env.TEMPLATE_ID,
                    form.current,
                    process.env.PUBLIC_KEY);
                  setAlert({ message: "Thank you for your interest!", type: "success" });
                  setSubmitting(false);
                  resetForm();
                } catch (error) {
                  console.error(error.text);
                  setAlert({ message: error.text || "Something went wrong", type: "error" });
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => {
                const buttonDisabled = !(!isSubmitting && values.email && !errors.email && values.message && !errors.message);

                return (<form
                  ref={form}
                  className="contact-form"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <input
                      className="form-input w-full rounded"
                      name="name"
                      type="text"
                      placeholder="Name"
                      onChange={handleChange}
                      value={values.name}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-input w-full rounded"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email && <p className="text-sm font-semibold text-red-400">{errors.email}</p>}
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-input w-full rounded"
                      name="subject"
                      type="text"
                      placeholder="Subject"
                      onChange={handleChange}
                      value={values.subject}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-textarea w-full rounded-md"
                      rows="7"
                      placeholder="Your message"
                      name="message"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.message}
                    />
                    {errors.message && touched.message && <p className="text-sm font-semibold text-red-400">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={buttonDisabled}
                    className={`btn ${buttonDisabled ? "bg-gray-300 rounded-full focus:outline-none" : "btn-primary"}`}
                  >
                    Send Now
                  </button>
                </form>
                )
              }}
            </Formik>
          </div>
          <div className="content col-12 md:col-6 lg:col-5">
            {markdownify(info.title, "h4")}
            {markdownify(info.description, "p", "mt-4")}
            <ul className="contact-list mt-5">
              {info.contacts.map((contact, index) => (
                <li key={index}>
                  {markdownify(contact, "strong", "text-dark")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
