<<<<<<< HEAD
package com.mecanosfera.nomos.service;

import java.net.URI;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class PlantillaArticuloPublicado {

    public MensajeEmail crear(ArticuloPublicadoEvent articulo, String frontendUrl) {
        String baseUrl = frontendUrl.replaceAll("/+$", "");
        String enlaceArticulo = baseUrl + "/articulo/" + articulo.id();
        String enlacePreferencias = baseUrl + "/perfil";
        String titulo = HtmlUtils.htmlEscape(articulo.titulo());
        String categoria = HtmlUtils.htmlEscape(articulo.categoria());
        String autor = HtmlUtils.htmlEscape(articulo.autor());
        String resumen = HtmlUtils.htmlEscape(articulo.resumen());
        String safeArticleUrl = HtmlUtils.htmlEscape(enlaceArticulo);
        String safePreferencesUrl = HtmlUtils.htmlEscape(enlacePreferencias);
        String imagen = imagenSegura(articulo.imagenUrl());

        String html = "<div style=\"margin:0;background:#f5f2ea;padding:32px 16px;font-family:Georgia,serif;color:#191714\">"
                + "<div style=\"max-width:640px;margin:auto;background:#fffdf8;border:1px solid #d2ccbf\">"
                + "<div style=\"padding:18px 24px;border-bottom:3px double #191714;font-size:13px;font-weight:bold;letter-spacing:1px\">CAOSMOSIS · NUEVA NOTA</div>"
                + imagen
                + "<div style=\"padding:28px 30px 32px\">"
                + "<p style=\"margin:0 0 12px;color:#a2382a;font:700 12px Arial,sans-serif;text-transform:uppercase\">" + categoria + "</p>"
                + "<h1 style=\"margin:0 0 16px;font-size:34px;line-height:1.12;font-weight:500\">" + titulo + "</h1>"
                + "<p style=\"margin:0 0 18px;color:#716e67;font:14px Arial,sans-serif\">Por " + autor + " · Nueva lectura en Caosmosis</p>"
                + "<p style=\"margin:0 0 24px;font-size:17px;line-height:1.65\">" + resumen + "</p>"
                + "<a href=\"" + safeArticleUrl + "\" style=\"display:inline-block;padding:13px 18px;background:#191714;color:#fffdf8;text-decoration:none;font:700 14px Arial,sans-serif\">Leer el artículo</a>"
                + "</div><div style=\"padding:18px 24px;border-top:1px solid #d2ccbf;color:#716e67;font:12px/1.6 Arial,sans-serif\">"
                + "Recibís este correo porque elegiste recibir novedades de Caosmosis. "
                + "<a href=\"" + safePreferencesUrl + "\" style=\"color:#812a21\">Gestionar preferencias</a>."
                + "</div></div></div>";

        String texto = "CAOSMOSIS · NUEVA NOTA\n\n" + articulo.categoria() + "\n" + articulo.titulo()
                + "\nPor " + articulo.autor() + "\n\n" + articulo.resumen()
                + "\n\nLeer el artículo: " + enlaceArticulo
                + "\n\nGestionar preferencias: " + enlacePreferencias;

        return new MensajeEmail("Nueva nota en Caosmosis: " + articulo.titulo(), texto, html);
    }

    private String imagenSegura(String url) {
        if (url == null || url.isBlank()) return "";
        try {
            URI parsed = URI.create(url);
            if (!"https".equalsIgnoreCase(parsed.getScheme()) || parsed.getHost() == null) return "";
            return "<img src=\"" + HtmlUtils.htmlEscape(parsed.toASCIIString())
                    + "\" alt=\"\" style=\"display:block;width:100%;height:auto;max-height:300px;object-fit:cover\">";
        } catch (IllegalArgumentException exception) {
            return "";
        }
    }
=======
package com.mecanosfera.nomos.service;

import java.net.URI;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class PlantillaArticuloPublicado {

    public MensajeEmail crear(ArticuloPublicadoEvent articulo, String frontendUrl) {
        String baseUrl = frontendUrl.replaceAll("/+$", "");
        String enlaceArticulo = baseUrl + "/articulo/" + articulo.id();
        String enlacePreferencias = baseUrl + "/perfil";
        String titulo = HtmlUtils.htmlEscape(articulo.titulo());
        String categoria = HtmlUtils.htmlEscape(articulo.categoria());
        String autor = HtmlUtils.htmlEscape(articulo.autor());
        String resumen = HtmlUtils.htmlEscape(articulo.resumen());
        String safeArticleUrl = HtmlUtils.htmlEscape(enlaceArticulo);
        String safePreferencesUrl = HtmlUtils.htmlEscape(enlacePreferencias);
        String imagen = imagenSegura(articulo.imagenUrl());

        String html = "<div style=\"margin:0;background:#f5f2ea;padding:32px 16px;font-family:Georgia,serif;color:#191714\">"
                + "<div style=\"max-width:640px;margin:auto;background:#fffdf8;border:1px solid #d2ccbf\">"
                + "<div style=\"padding:18px 24px;border-bottom:3px double #191714;font-size:13px;font-weight:bold;letter-spacing:1px\">CAOSMOSIS · NUEVA NOTA</div>"
                + imagen
                + "<div style=\"padding:28px 30px 32px\">"
                + "<p style=\"margin:0 0 12px;color:#a2382a;font:700 12px Arial,sans-serif;text-transform:uppercase\">" + categoria + "</p>"
                + "<h1 style=\"margin:0 0 16px;font-size:34px;line-height:1.12;font-weight:500\">" + titulo + "</h1>"
                + "<p style=\"margin:0 0 18px;color:#716e67;font:14px Arial,sans-serif\">Por " + autor + " · Nueva lectura en Caosmosis</p>"
                + "<p style=\"margin:0 0 24px;font-size:17px;line-height:1.65\">" + resumen + "</p>"
                + "<a href=\"" + safeArticleUrl + "\" style=\"display:inline-block;padding:13px 18px;background:#191714;color:#fffdf8;text-decoration:none;font:700 14px Arial,sans-serif\">Leer el artículo</a>"
                + "</div><div style=\"padding:18px 24px;border-top:1px solid #d2ccbf;color:#716e67;font:12px/1.6 Arial,sans-serif\">"
                + "Recibís este correo porque elegiste recibir novedades de Caosmosis. "
                + "<a href=\"" + safePreferencesUrl + "\" style=\"color:#812a21\">Gestionar preferencias</a>."
                + "</div></div></div>";

        String texto = "CAOSMOSIS · NUEVA NOTA\n\n" + articulo.categoria() + "\n" + articulo.titulo()
                + "\nPor " + articulo.autor() + "\n\n" + articulo.resumen()
                + "\n\nLeer el artículo: " + enlaceArticulo
                + "\n\nGestionar preferencias: " + enlacePreferencias;

        return new MensajeEmail("Nueva nota en Caosmosis: " + articulo.titulo(), texto, html);
    }

    private String imagenSegura(String url) {
        if (url == null || url.isBlank()) return "";
        try {
            URI parsed = URI.create(url);
            if (!"https".equalsIgnoreCase(parsed.getScheme()) || parsed.getHost() == null) return "";
            return "<img src=\"" + HtmlUtils.htmlEscape(parsed.toASCIIString())
                    + "\" alt=\"\" style=\"display:block;width:100%;height:auto;max-height:300px;object-fit:cover\">";
        } catch (IllegalArgumentException exception) {
            return "";
        }
    }
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}