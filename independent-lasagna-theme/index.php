<?php
/**
 * Blog listing (News / "Slices of Lasagna").
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="page-hero">
	<div class="container il-fade">
		<span class="eyebrow"><?php esc_html_e( 'Slices of Lasagna', 'independent-lasagna' ); ?></span>
		<h1>
			<?php
			if ( is_home() && ! is_front_page() ) {
				single_post_title();
			} elseif ( is_category() || is_tag() || is_archive() ) {
				the_archive_title();
			} elseif ( is_search() ) {
				printf( esc_html__( 'Search results for: %s', 'independent-lasagna' ), '<span>' . get_search_query() . '</span>' );
			} else {
				esc_html_e( 'News', 'independent-lasagna' );
			}
			?>
		</h1>
	</div>
</section>

<section class="section section--dark">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="grid grid--3">
				<?php
				$i = 0;
				while ( have_posts() ) :
					the_post();
					?>
					<article class="card il-fade" style="animation-delay:<?php echo esc_attr( ( $i % 3 ) * 70 ); ?>ms">
						<?php if ( has_post_thumbnail() ) : ?>
							<div class="card__media"><a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'il-card' ); ?></a></div>
						<?php endif; ?>
						<span class="eyebrow"><?php echo esc_html( get_the_date() ); ?></span>
						<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p><?php the_excerpt(); ?></p>
						<a class="link-arrow" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Read more', 'independent-lasagna' ); ?></a>
					</article>
					<?php
					$i++;
				endwhile;
				?>
			</div>
			<div class="pagination il-fade">
				<?php the_posts_pagination( array( 'prev_text' => __( '← Newer', 'independent-lasagna' ), 'next_text' => __( 'Older →', 'independent-lasagna' ) ) ); ?>
			</div>
		<?php else : ?>
			<div class="empty-state il-fade">
				<p><?php esc_html_e( 'Nothing published yet — check back soon.', 'independent-lasagna' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php get_footer(); ?>
