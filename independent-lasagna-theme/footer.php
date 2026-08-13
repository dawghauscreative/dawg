<?php
/**
 * Footer template.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main><!-- #site-main -->

<footer class="site-footer">
	<div class="container footer-grid">

		<div class="footer-col footer-col--brand">
			<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<span class="site-branding__wordmark">Independent<em>Lasagna</em></span>
				<?php endif; ?>
			</a>
			<p class="footer-tagline"><?php esc_html_e( 'A social production company. Video, web, social, and film — made independent.', 'independent-lasagna' ); ?></p>
			<?php il_social_links(); ?>
		</div>

		<div class="footer-col">
			<h3 class="footer-col__title"><?php esc_html_e( 'Explore', 'independent-lasagna' ); ?></h3>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'container'      => false,
					'menu_class'     => 'footer-nav',
					'fallback_cb'    => 'il_primary_menu_fallback',
					'depth'          => 1,
				)
			);
			?>
		</div>

		<div class="footer-col">
			<h3 class="footer-col__title"><?php esc_html_e( 'Get In Touch', 'independent-lasagna' ); ?></h3>
			<ul class="footer-contact">
				<li><a href="mailto:info@independentlasagna.com">info@independentlasagna.com</a></li>
				<li><a href="mailto:weddings@independentlasagna.com"><?php esc_html_e( 'Weddings:', 'independent-lasagna' ); ?> weddings@independentlasagna.com</a></li>
				<li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a project →', 'independent-lasagna' ); ?></a></li>
			</ul>
		</div>

		<?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
			<div class="footer-col">
				<?php dynamic_sidebar( 'footer-1' ); ?>
			</div>
		<?php endif; ?>

	</div>

	<div class="container footer-bottom">
		<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'Let\'s do it together.', 'independent-lasagna' ); ?></p>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
