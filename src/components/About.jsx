import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const About = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="about" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h2 className="h3 text-primary mb-3 text-center">Hakkımda</h2>
            <p className="text-secondary text-center">
              Yazılım dünyasına duyduğum merakı, sürekli öğrenen ve üreten bir
              Front-End Geliştirici kimliğine dönüştürdüm. HTML, CSS,
              JavaScript, TypeScript ve React gibi modern web teknolojileriyle
              kullanıcı odaklı arayüzler tasarlarken; açık kaynak dünyasına
              katkı sağlamaktan ve Medium üzerinde teknik deneyimlerimi
              paylaşmaktan keyif alıyorum. Sadece arayüz geliştirmekle kalmıyor;
              Python, C#, PowerShell ve Arduino gibi farklı disiplinlere de
              dokunarak çok yönlü (versatile) bir mühendislik bakış açısı
              kazanmayı hedefliyorum.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
