import React, { useEffect, useState } from 'react';
import Carousel from './Cer-Animation';
import './Certificates.css';
import { FiFileText } from 'react-icons/fi';

export default function Certificates() {
    const [items, setItems] = useState(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch('http://localhost:5000/api/certificates');
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                if (!mounted) return;

                const certs = Array.isArray(data) ? data : [];
                const mapped = certs.map(cert => {
                    const thumb = cert.thumbnail ;
                    return {
                        title: cert.title || cert.name || 'Certificate',
                        description: cert.description || cert.issuedBy || cert.issuer || '',
                        url: cert.certificateUrl || cert.url || cert.thumbnail || '',
                        id: cert._id || cert.id || Math.random().toString(36).slice(2),
                        thumbnail: thumb,
                        bgStyle: thumb ? {
                            backgroundImage: thumb,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        } : {},
                        icon: <FiFileText className="carousel-icon" />
                    };
                });

                setItems(mapped);
            } catch (err) {
                console.error('Failed to load certificates', err);
                if (mounted) setItems([]); // show empty state on error
            }
        })();

        return () => { mounted = false; };
    }, []);

    if (items === null) return <div className="certificates-loading">Loading certificates...</div>;
    if (items.length === 0) return <div className="certificates-empty">No certificates found</div>;

    return (
        <div className="certificates-root">
            <Carousel items={items} baseWidth={360} autoplay autoplayDelay={4000} loop />
        </div>
    );
}