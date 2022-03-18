import { Link } from 'react-router-dom';

export const HomePage = (): JSX.Element => {
  return (
    <>
      <h1>Welcome 👀</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/apps">About</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
