import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
    }}>
      <Result
        status="404"
        title="404"
        subTitle="К сожалению, мы ещё не нашли такой страницы!"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Вернуться на главную страницу
          </Button>
        }
      />
    </div>
  )
}
